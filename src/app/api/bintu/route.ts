import { NextResponse } from 'next/server';
import {
  type BintuSource,
  buildBintuRetrievalQuery,
  createBintuEmbedding,
  ensureBintuSession,
  fetchBintuMatches,
  generateBintuReply,
  getBintuFallbackResponse,
  getBintuServiceClient,
  hasStrongBintuSupport,
  loadRecentBintuMessages,
  persistBintuTurn,
  serializeBintuSources,
  verifyBintuAccessToken,
} from '@/lib/bintu';

export const runtime = 'nodejs';

function getBearerToken(req: Request) {
  const authorization = req.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) {
    return null;
  }

  return authorization.slice('Bearer '.length).trim() || null;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Bintu could not respond right now.';
}

export async function POST(req: Request) {
  try {
    const token = getBearerToken(req);
    if (!token) {
      return NextResponse.json({ error: 'Authentication is required.' }, { status: 401 });
    }

    const userId = await verifyBintuAccessToken(token);
    if (!userId) {
      return NextResponse.json({ error: 'Your session is no longer valid. Please sign in again.' }, { status: 401 });
    }

    const body = await req.json();
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const sessionId = typeof body.sessionId === 'string' ? body.sessionId : null;

    if (!message) {
      return NextResponse.json({ error: 'Please enter a message for Bintu.' }, { status: 400 });
    }

    const serviceClient = getBintuServiceClient();
    const activeSessionId = await ensureBintuSession(serviceClient, userId, sessionId, message);
    const history = await loadRecentBintuMessages(serviceClient, userId, activeSessionId);
    const retrievalQuery = buildBintuRetrievalQuery(message, history);
    const queryEmbedding = await createBintuEmbedding(retrievalQuery);
    const matches = await fetchBintuMatches(serviceClient, queryEmbedding);

    let answer = getBintuFallbackResponse();
    let sources: BintuSource[] = [];
    let fallbackUsed = true;

    if (hasStrongBintuSupport(retrievalQuery, matches)) {
      answer = await generateBintuReply(message, history, matches);
      sources = serializeBintuSources(matches);
      fallbackUsed = false;
    }

    try {
      await persistBintuTurn(serviceClient, userId, activeSessionId, message, answer, sources);
    } catch (persistenceError) {
      console.error('Bintu persistence warning:', persistenceError);
    }

    return NextResponse.json({
      sessionId: activeSessionId,
      answer,
      sources,
      fallbackUsed,
    });
  } catch (error: unknown) {
    console.error('Bintu API error:', error);
    return NextResponse.json(
      {
        error: getErrorMessage(error) || 'Bintu could not respond right now.',
      },
      { status: 500 }
    );
  }
}
