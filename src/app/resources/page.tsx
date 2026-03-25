'use client';

import { useState } from 'react';
import styles from './resources.module.css';

type Article = {
    cat: string;
    title: string;
    desc: string;
    icon: string;
    content?: React.ReactNode;
};

const howToSpotScamsContent = (
    <div className={styles.articleContent}>
        <p>Remote work has opened up incredible opportunities for professionals around the world. But it has also created a new playground for scammers. Fraudsters frequently post fake remote job listings to steal money, personal information, or even identities from unsuspecting job seekers. In fact, reported losses from job scams have surged in recent years, reaching hundreds of millions of dollars annually.</p>
        <p>The good news: most fake job postings follow predictable patterns. If you know the warning signs, you can spot them before wasting time—or worse, losing money.</p>
        <p>Below are five major red flags to watch for before applying to any remote role.</p>

        <h3>1. The Job Promises Unrealistic Pay for Easy Work</h3>
        <p>One of the most common tactics used in scam job listings is offering unusually high pay for simple tasks. Listings that promise large salaries for minimal work—such as data entry, social media “boosting,” or reviewing products—should immediately raise suspicion.</p>
        <p>Scammers rely on the “too good to be true” effect. High pay attracts large numbers of applicants quickly, increasing the chance someone will fall for the scheme.</p>
        <p>Examples of suspicious offers:</p>
        <ul>
            <li>“Earn $500 a day reviewing products”</li>
            <li>“Work 2 hours a day and make $5,000 per month”</li>
            <li>“No experience required, immediate hiring”</li>
        </ul>
        <p>Real employers generally pay according to industry standards and expect specific skills or responsibilities.</p>
        <div className={styles.tipBox}>
            <strong>Tip:</strong> Always compare the salary with similar roles on legitimate job boards. If it’s wildly above the market rate, investigate further before applying.
        </div>

        <h3>2. They Ask for Money Upfront</h3>
        <p>A legitimate employer will never require payment during the hiring process. If a job requires you to pay for training, equipment, application processing, or background checks, it is almost certainly a scam.</p>
        <p>Fraudsters often disguise these payments as:</p>
        <ul>
            <li>“Training fees”</li>
            <li>“Equipment deposits”</li>
            <li>“Certification costs”</li>
            <li>“Onboarding charges”</li>
        </ul>
        <p>Once the money is sent, the recruiter disappears.</p>
        <div className={styles.tipBox}>
            <strong>Golden rule:</strong> If you have to pay to get the job, it’s not a real job.
        </div>

        <h3>3. The Hiring Process Is Suspiciously Fast or Informal</h3>
        <p>Real companies invest time in hiring. They conduct interviews, evaluate qualifications, and verify identities. Scammers skip these steps because their goal is to move quickly before victims notice the red flags.</p>
        <p>Watch out for situations where:</p>
        <ul>
            <li>You receive a job offer immediately after applying</li>
            <li>The interview happens only through text or messaging apps</li>
            <li>There is no video call or proper interview</li>
            <li>The recruiter avoids questions about the company</li>
        </ul>
        <p>Legitimate hiring processes may take days or weeks, not minutes.</p>

        <h3>4. The Recruiter Uses Unofficial Contact Details</h3>
        <p>Another major warning sign is when communication comes from generic email domains such as Gmail, Yahoo, or Outlook instead of a company domain.</p>
        <p>For example:</p>
        <ul>
            <li>❌ hiring.company@gmail.com</li>
            <li>✅ careers@companyname.com</li>
        </ul>
        <p>Scammers may also push communication to messaging apps like WhatsApp or Telegram to avoid traceability.</p>
        <p>How to verify a recruiter:</p>
        <ul>
            <li>Check if the recruiter has a credible LinkedIn profile</li>
            <li>Look up the company’s official website</li>
            <li>Confirm the job listing appears on the company’s careers page</li>
        </ul>
        <p>If you can’t verify the employer independently, proceed with caution.</p>

        <h3>5. The Job Description Is Vague or Poorly Written</h3>
        <p>Many fraudulent job postings contain unclear responsibilities, missing company details, or obvious spelling and grammar mistakes.</p>
        <p>Typical signs include:</p>
        <ul>
            <li>Generic descriptions like “online assistant needed”</li>
            <li>No clear company information or business activities</li>
            <li>Multiple spelling errors</li>
            <li>Lack of detailed responsibilities or requirements</li>
        </ul>
        <p>Legitimate employers usually provide clear descriptions of the role, responsibilities, skills required, and company background.</p>

        <h3>Bonus Warning Signs</h3>
        <p>While the five red flags above are the most common, additional warning signs include:</p>
        <ul>
            <li>Pressure to act quickly (“apply now or lose the opportunity”)</li>
            <li>Requests for sensitive personal information early in the process</li>
            <li>Unsolicited job offers sent through text or social media</li>
            <li>Tasks involving reshipping packages or cashing checks</li>
        </ul>
        <p>Many scams start with simple “task jobs” that appear legitimate before eventually demanding money or personal data.</p>

        <h3>How to Protect Yourself</h3>
        <p>Before applying for any remote job, take a few simple steps:</p>
        <ul>
            <li><strong>Research the company</strong> – Look for an official website and verified presence online.</li>
            <li><strong>Check the recruiter</strong> – Confirm their identity on LinkedIn or the company’s site.</li>
            <li><strong>Search the job posting</strong> – Scam listings are often duplicated across multiple sites.</li>
            <li><strong>Trust your instincts</strong> – If something feels off, investigate further.</li>
        </ul>
        <p>Never send money or sensitive information during the hiring process.</p>

        <h3>Final Thoughts</h3>
        <p>Remote work is here to stay—and so are remote job scams. Fraudsters thrive on urgency, excitement, and lack of verification. But once you understand the warning signs, most scams become easy to identify.</p>
        <p>When it comes to job applications, skepticism is not negativity—it’s protection. Take a few minutes to verify every opportunity before applying. It could save you time, money, and a major headache.</p>
    </div>
);

const fiveElementsContent = (
    <div className={styles.articleContent}>
        <p>Winning a grant is rarely about luck. Behind every successful application is a carefully crafted narrative that convinces reviewers your idea deserves investment. Grant reviewers typically read dozens—sometimes hundreds—of applications. The proposals that stand out all share several core elements that clearly communicate the value, feasibility, and impact of the project.</p>
        <p>If you want your grant essay to rise above the competition, these five elements must be present.</p>

        <h3>1. A Clear and Compelling Problem Statement</h3>
        <p>Every strong grant essay begins by answering a simple but powerful question: What problem are you solving?</p>
        <p>Funders need to understand why your project matters before they consider funding it. A strong problem statement clearly defines the issue, explains why it is important, and demonstrates the urgency of addressing it. This section sets the foundation for the entire proposal.</p>
        <p>Effective problem statements often combine data and real-world context. Statistics, research findings, or measurable trends can illustrate the scale of the issue, while short anecdotes or examples help make the problem relatable and human. When reviewers understand both the facts and the real-world consequences, they are far more likely to support the solution being proposed.</p>
        <p>Grant experts consistently emphasize that a proposal must clearly define the need being addressed and explain how solving it will benefit the target community or industry.</p>
        <p>What makes it strong:</p>
        <ul>
            <li>Clearly defined problem</li>
            <li>Evidence or data supporting the need</li>
            <li>Explanation of why the issue matters now</li>
            <li>Alignment with the funder&apos;s mission or priorities</li>
        </ul>

        <h3>2. A Well-Defined Solution</h3>
        <p>Once the problem is established, your essay must clearly explain how your project will solve it.</p>
        <p>This is where you outline your idea, program, research, or initiative. The key is clarity. Reviewers should be able to understand exactly what you plan to do, how it works, and why your approach is effective.</p>
        <p>A strong solution section answers questions such as:</p>
        <ul>
            <li>What exactly will the project do?</li>
            <li>Who will benefit from it?</li>
            <li>Why is your approach better or more effective than existing solutions?</li>
        </ul>
        <p>Funders want to see that your project is both innovative and practical. Your proposal should show that you have thought through the details and that the solution is achievable within the proposed timeline and budget. Successful proposals often present a clear narrative explaining the significance of the project and the strategy used to deliver results.</p>

        <h3>3. Specific Goals and Measurable Outcomes</h3>
        <p>A winning grant essay doesn’t just describe a good idea—it explains what success will look like.</p>
        <p>Funders want to know what results their money will produce. This is why strong grant proposals include clear goals and measurable objectives. Goals describe the overall impact you want to achieve, while objectives break those goals into specific outcomes.</p>
        <p>Many grant professionals recommend using SMART objectives—goals that are specific, measurable, achievable, relevant, and time-bound. This makes it easier for reviewers to evaluate the project&apos;s effectiveness and ensures accountability for the funding being requested.</p>
        <p>Examples of measurable outcomes might include:</p>
        <ul>
            <li>Number of people trained or supported</li>
            <li>Reduction in a specific problem or risk</li>
            <li>Increase in access to a service or opportunity</li>
            <li>Development of a new product, tool, or platform</li>
        </ul>
        <p>Clear outcomes show that your project is not just an idea—it is a plan designed to deliver tangible impact.</p>

        <h3>4. A Realistic Implementation Plan</h3>
        <p>A great idea is only convincing if it can actually be executed.</p>
        <p>The implementation plan explains how the project will be carried out step by step. It typically includes the activities involved, the timeline for each stage, and the people responsible for delivering the work.</p>
        <p>This section reassures reviewers that the project is feasible. It demonstrates that your team understands the practical challenges involved and has developed a structured approach to address them.</p>
        <p>Strong implementation plans often include:</p>
        <ul>
            <li>Project timeline or milestones</li>
            <li>Key activities and deliverables</li>
            <li>Roles and responsibilities of team members</li>
            <li>Methods or processes used to achieve results</li>
        </ul>
        <p>Grant reviewers are far more likely to fund projects that show a clear pathway from idea to execution.</p>

        <h3>5. Credibility and Capacity to Deliver</h3>
        <p>Finally, a winning grant essay proves that you or your organization can actually deliver the project.</p>
        <p>Even the best ideas require capable teams to bring them to life. Funders want assurance that the applicant has the skills, experience, and resources necessary to execute the project successfully.</p>
        <p>This section often highlights:</p>
        <ul>
            <li>Past achievements or relevant experience</li>
            <li>Qualifications of the team or organization</li>
            <li>Partnerships or collaborators involved in the project</li>
            <li>Evidence of previous successful projects</li>
        </ul>
        <p>Demonstrating organizational capacity significantly strengthens a proposal because it reassures funders that their investment will be managed effectively and responsibly.</p>

        <h3>Final Thoughts</h3>
        <p>A winning grant essay is more than just persuasive writing—it is a clear, structured argument for why your project deserves funding.</p>
        <p>The most successful applications consistently include:</p>
        <ul>
            <li>A compelling problem statement</li>
            <li>A well-defined solution</li>
            <li>Clear goals and measurable outcomes</li>
            <li>A realistic implementation plan</li>
            <li>Demonstrated credibility and capacity</li>
        </ul>
        <p>When these elements work together, your proposal tells a powerful story: a real problem exists, you have a practical solution, and your team has the ability to deliver meaningful results.</p>
        <p>That combination is what turns a good grant essay into a funded one.</p>
    </div>
);

const understandingFellowshipsContent = (
    <div className={styles.articleContent}>
        <p>People often use the terms fellowship and grant interchangeably, but they are not the same thing. Both are forms of financial support that do not need to be repaid, yet they serve different purposes and are structured in different ways.</p>
        <p>Understanding the distinction is important when deciding which opportunities to pursue. Applying for the wrong type of funding—or framing your application incorrectly—can significantly reduce your chances of success.</p>
        <p>This guide explains how fellowships and standard grants differ, what each one funds, and how to determine which option best fits your goals.</p>

        <h3>What Is a Standard Grant?</h3>
        <p>A grant is financial funding provided by a government agency, foundation, organization, or institution to support a specific project, program, research activity, or initiative. The funding is awarded based on a proposal that explains what will be done with the money and how the project will achieve measurable results.</p>
        <p>Grants are typically awarded to:</p>
        <ul>
            <li>Nonprofit organizations</li>
            <li>Academic researchers</li>
            <li>public institutions</li>
            <li>startups or social enterprises</li>
            <li>community initiatives</li>
        </ul>
        <p>The key defining feature of a grant is that the money is tied to a clearly defined project or activity.</p>

        <h3>How Grants Work</h3>
        <p>When applying for a grant, applicants usually submit a detailed proposal that includes:</p>
        <ul>
            <li>The problem or need being addressed</li>
            <li>The proposed solution or project plan</li>
            <li>Project goals and expected outcomes</li>
            <li>Budget and financial breakdown</li>
            <li>Timeline for implementation</li>
        </ul>
        <p>Once awarded, the funds must generally be used only for the purposes described in the proposal. Most grant funders also require reporting to demonstrate how the money was used and what outcomes were achieved.</p>

        <h3>Examples of Grant Funding</h3>
        <p>Common examples include:</p>
        <ul>
            <li>Research grants for scientific studies</li>
            <li>Community development grants for local programs</li>
            <li>innovation grants for technology projects</li>
            <li>education grants for schools or training programs</li>
        </ul>
        <p>Government agencies such as national research councils, international development agencies, and private foundations commonly provide grant funding.</p>

        <h3>What Is a Fellowship?</h3>
        <p>A fellowship is a funding award given to an individual rather than a project alone, typically to support professional development, research, academic study, or leadership advancement.</p>
        <p>Fellowships are designed to invest in people rather than simply fund a specific activity.</p>
        <p>Many fellowships provide financial support to allow recipients to focus on their work, research, training, or leadership development without financial pressure.</p>
        <p>Fellowships are commonly awarded to:</p>
        <ul>
            <li>Graduate students</li>
            <li>early-career professionals</li>
            <li>researchers</li>
            <li>policy specialists</li>
            <li>entrepreneurs</li>
            <li>artists or creative professionals</li>
        </ul>
        <p>Unlike grants, fellowships often emphasize the individual’s potential, achievements, and leadership qualities.</p>

        <h3>What Fellowships Usually Provide</h3>
        <p>Fellowships can include several types of support, such as:</p>
        <ul>
            <li>Stipends or living allowances</li>
            <li>Research funding</li>
            <li>Travel funding</li>
            <li>Tuition coverage</li>
            <li>mentorship and training programs</li>
            <li>access to professional networks</li>
        </ul>
        <p>Some fellowships are highly structured programs that include training, workshops, or residencies alongside the financial support.</p>

        <h3>The Key Differences Between Fellowships and Grants</h3>
        <p>Although both provide funding that does not require repayment, the structure and focus of these funding types differ in several important ways.</p>

        <h4>1. Focus of Funding</h4>
        <p><strong>Grants:</strong><br />Fund a specific project, program, or initiative.</p>
        <p><strong>Fellowships:</strong><br />Fund an individual’s development, research, or leadership.</p>

        <h4>2. Who Receives the Funding</h4>
        <p><strong>Grants:</strong><br />Usually awarded to organizations, institutions, or research teams.</p>
        <p><strong>Fellowships:</strong><br />Typically awarded directly to individuals.</p>

        <h4>3. Use of Funds</h4>
        <p><strong>Grants:</strong><br />Funds must be used strictly for the approved project activities outlined in the proposal.</p>
        <p><strong>Fellowships:</strong><br />Funds may support a person’s living expenses, training, research time, or professional development.</p>

        <h4>4. Evaluation Criteria</h4>
        <p>Grant applications are evaluated based on:</p>
        <ul>
            <li>project impact</li>
            <li>feasibility of the proposed work</li>
            <li>alignment with the funder&apos;s mission</li>
            <li>measurable outcomes</li>
        </ul>
        <p>Fellowship applications are evaluated based on:</p>
        <ul>
            <li>the applicant’s achievements</li>
            <li>leadership potential</li>
            <li>research or career goals</li>
            <li>the broader impact of the individual’s work</li>
        </ul>

        <h4>5. Reporting and Oversight</h4>
        <p><strong>Grants:</strong><br />Often require structured reporting, progress updates, and financial accountability tied to project milestones.</p>
        <p><strong>Fellowships:</strong><br />Reporting requirements tend to focus more on the fellow’s progress, research outputs, or program participation rather than detailed project budgets.</p>

        <h3>When to Apply for a Grant</h3>
        <p>You should consider pursuing a grant if you have:</p>
        <ul>
            <li>a clearly defined project</li>
            <li>a structured plan for implementation</li>
            <li>measurable outcomes or deliverables</li>
            <li>an organization or team capable of carrying out the work</li>
        </ul>
        <p>Grants are ideal when funding is needed to launch or expand a program, develop a product, conduct research, or deliver a service.</p>

        <h3>When to Apply for a Fellowship</h3>
        <p>A fellowship may be a better fit if you are seeking funding to:</p>
        <ul>
            <li>pursue research or study</li>
            <li>develop leadership skills</li>
            <li>advance your career or expertise</li>
            <li>explore innovative ideas or projects</li>
        </ul>
        <p>Fellowships are particularly common in academic fields, public policy, technology innovation, social entrepreneurship, and the arts.</p>

        <h3>Can Fellowships Include Projects?</h3>
        <p>Yes. Many fellowships require recipients to work on a specific research topic or initiative during the program. However, the key difference is that the funding is awarded primarily to support the fellow’s development and work, rather than solely funding a standalone project.</p>

        <h3>Why Understanding the Difference Matters</h3>
        <p>Recognizing the difference between fellowships and standard grants helps applicants:</p>
        <ul>
            <li>target the right funding opportunities</li>
            <li>structure their applications correctly</li>
            <li>highlight the criteria funders care about most</li>
        </ul>
        <p>Applicants who frame their proposal incorrectly—for example, focusing on a project when applying for a fellowship that prioritizes leadership potential—often weaken their applications.</p>
        <p>Understanding the expectations behind each type of funding significantly improves the chances of success.</p>

        <h3>Final Thoughts</h3>
        <p>Both fellowships and grants are powerful funding tools that support innovation, research, education, and social impact.</p>
        <p>The main distinction is simple:</p>
        <ul>
            <li>Grants fund projects.</li>
            <li>Fellowships fund people.</li>
        </ul>
        <p>By understanding this difference, applicants can choose the opportunities that best match their goals and present stronger, more effective applications.</p>
        <p>Whether you are building a program, conducting research, or advancing your professional journey, selecting the right type of funding is the first step toward turning your ideas into reality.</p>
    </div>
);

const coldEmailingRecruitersContent = (
    <div className={styles.articleContent}>
        <p>Cold-emailing recruiters is one of the most effective—yet underused—ways to access job opportunities, especially those that are never publicly advertised. Done right, it can put you directly in front of decision-makers and dramatically increase your chances of landing interviews.</p>
        <p>Done poorly, it gets ignored.</p>
        <p>This guide breaks down exactly how to cold-email recruiters in a way that is professional, strategic, and effective—based on how hiring processes actually work.</p>

        <h3>What Cold-Emailing Recruiters Really Means</h3>
        <p>Cold-emailing is reaching out to a recruiter or hiring manager without a prior relationship, with the goal of introducing yourself and expressing interest in opportunities.</p>
        <p>Recruiters are typically responsible for:</p>
        <ul>
            <li>Sourcing candidates</li>
            <li>Screening applications</li>
            <li>Managing parts of the hiring process</li>
        </ul>
        <p>Because of this, they are constantly looking for qualified candidates—but they also receive a high volume of messages. Your goal is to make it easy for them to quickly understand your value.</p>

        <h3>Why Cold-Emailing Works</h3>
        <p>Many roles are filled through:</p>
        <ul>
            <li>Internal referrals</li>
            <li>Talent pipelines</li>
            <li>Direct sourcing by recruiters</li>
        </ul>
        <p>This means not all roles are widely advertised. A well-timed email can:</p>
        <ul>
            <li>Put you on a recruiter’s radar early</li>
            <li>Position you for upcoming roles</li>
            <li>Help you bypass crowded job portals</li>
        </ul>
        <p>Cold-emailing works because it shows initiative and clarity, two qualities recruiters actively look for.</p>

        <h3>Step 1: Identify the Right Recruiter</h3>
        <p>Not all recruiters are the same. Targeting the wrong person reduces your chances significantly.</p>
        <p>You should focus on:</p>
        <ul>
            <li>Recruiters working at the company you’re interested in</li>
            <li>Recruiters specializing in your industry or role (e.g., QA, product, engineering)</li>
            <li>Internal recruiters (often titled Talent Acquisition, Recruiter, People Partner)</li>
        </ul>
        <p>Use platforms like:</p>
        <ul>
            <li>LinkedIn</li>
            <li>Company websites</li>
            <li>Professional directories</li>
        </ul>
        <p>For example, if you&apos;re targeting QA roles (which fits your background), look for recruiters hiring for software quality, test engineering, or platform roles, not generalists unless the company is small.</p>

        <h3>Step 2: Do Minimal but Smart Research</h3>
        <p>You don’t need a full company deep dive—but you do need just enough context to avoid sounding generic.</p>
        <p>Before emailing, know:</p>
        <ul>
            <li>What the company does</li>
            <li>Whether they are hiring in your area</li>
            <li>Something specific (product, recent launch, growth area)</li>
        </ul>
        <p>This allows you to tailor your message slightly without overcomplicating it.</p>

        <h3>Step 3: Use a Clear and Relevant Subject Line</h3>
        <p>Your subject line determines whether your email gets opened.</p>
        <p>Strong subject lines are:</p>
        <ul>
            <li>Specific</li>
            <li>Professional</li>
            <li>Easy to scan</li>
        </ul>
        <p>Examples:</p>
        <ul>
            <li>QA Analyst with 8+ Years Experience – Interested in Opportunities at [Company]</li>
            <li>Application Inquiry – Senior QA / Test Analyst</li>
            <li>Experienced QA Engineer – Open to Roles at [Company]</li>
        </ul>
        <p>Avoid vague lines like:</p>
        <ul>
            <li>“Hello”</li>
            <li>“Job inquiry”</li>
            <li>“Quick question”</li>
        </ul>

        <h3>Step 4: Keep the Email Short and Structured</h3>
        <p>Recruiters scan emails quickly. If your message is too long or unclear, it will likely be ignored.</p>
        <p>A strong cold email has four simple parts:</p>
        <h4>1. Introduction</h4>
        <p>Briefly state who you are and your current role.</p>
        <h4>2. Value Proposition</h4>
        <p>Highlight 1–2 key strengths or achievements relevant to the role.</p>
        <h4>3. Intent</h4>
        <p>Clearly state what you are looking for (e.g., open roles, future opportunities).</p>
        <h4>4. Call to Action</h4>
        <p>Invite a response without being demanding.</p>

        <h3>Step 5: Focus on Relevance, Not Your Life Story</h3>
        <p>Recruiters are not looking for your full career history in an email. They want to quickly assess:</p>
        <ul>
            <li>Are you relevant?</li>
            <li>Are you experienced enough?</li>
            <li>Are you worth a follow-up?</li>
        </ul>
        <p>This means:</p>
        <ul>
            <li>Highlight impact, not responsibilities</li>
            <li>Mention tools, domains, or industries relevant to the role</li>
            <li>Keep it concise</li>
        </ul>
        <p>For example, instead of listing duties, briefly mention outcomes such as improving test coverage, reducing defects, or supporting major product releases.</p>

        <h3>Step 6: Attach or Link Your CV and Profile</h3>
        <p>Always make it easy for recruiters to learn more about you.</p>
        <p>Include:</p>
        <ul>
            <li>Your CV (PDF format)</li>
            <li>A link to your LinkedIn profile</li>
        </ul>
        <p>Do not assume they will ask for it later—remove friction upfront.</p>

        <h3>Step 7: Timing and Follow-Up Matter</h3>
        <p>Recruiters are busy, and emails can be missed.</p>
        <p>Best practices:</p>
        <ul>
            <li>Send emails during working hours (typically morning or early afternoon)</li>
            <li>If no response, follow up once after 5–7 working days</li>
            <li>Keep follow-ups short and polite</li>
        </ul>
        <p>Avoid sending multiple aggressive follow-ups. That can damage your impression.</p>

        <h3>Step 8: Common Mistakes to Avoid</h3>
        <p>Many cold emails fail for avoidable reasons.</p>
        <p><strong>Being too generic:</strong><br />Messages that could be sent to any company are easy to ignore.</p>
        <p><strong>Writing too much:</strong><br />Long emails reduce readability and engagement.</p>
        <p><strong>Lack of clarity:</strong><br />If the recruiter cannot quickly understand what you want, they move on.</p>
        <p><strong>Overconfidence or pressure:</strong><br />Avoid statements that assume entitlement to a role.</p>
        <p><strong>No proof of value:</strong><br />Saying “I’m hardworking and passionate” without evidence is ineffective.</p>

        <h3>Step 9: A Simple Cold Email Template</h3>
        <p>Here’s a clean, effective structure you can adapt:</p>
        <div className={styles.tipBox}>
            <p><strong>Subject:</strong> Senior QA Analyst – Interested in Opportunities at [Company]</p>
            <p><strong>Email Body:</strong></p>
            <p>Hello [Recruiter’s Name],</p>
            <p>My name is [Your Name], and I’m a Senior QA Analyst with [X years] of experience in software testing and quality assurance.</p>
            <p>I’ve worked on [brief relevant experience—e.g., large-scale platforms, automation support, high-traffic systems], where I contributed to [specific outcome or impact].</p>
            <p>I’m currently exploring new opportunities and would be very interested in roles within your team at [Company].</p>
            <p>I’ve attached my CV and included my LinkedIn profile below for your review. I’d appreciate the opportunity to connect if there are any suitable roles now or in the near future.</p>
            <p>Best regards,<br />[Your Name]<br />[LinkedIn URL]</p>
        </div>

        <h3>Step 10: Think Long-Term, Not One Email</h3>
        <p>Cold-emailing is not just about immediate results. It’s about building visibility.</p>
        <p>Even if a recruiter doesn’t respond right away, they may:</p>
        <ul>
            <li>Save your profile</li>
            <li>Reach out later when a role opens</li>
            <li>Add you to their talent pipeline</li>
        </ul>
        <p>Consistency matters more than a single perfect email.</p>

        <h3>Final Thoughts</h3>
        <p>Cold-emailing recruiters is a skill—and like any skill, it improves with practice.</p>
        <p>The formula is straightforward:</p>
        <ul>
            <li>Target the right person</li>
            <li>Keep your message clear and concise</li>
            <li>Show relevant value quickly</li>
            <li>Make it easy to respond</li>
        </ul>
        <p>Most people either don’t do this at all or do it poorly. If you approach it strategically, you immediately place yourself ahead of the majority of candidates.</p>
        <p>If you want to take it further, the next step is to create role-specific versions of your email (e.g., QA, product, operations). That’s where cold outreach starts turning into real interview pipelines.</p>
    </div>
);

const managingFirstBigGrantContent = (
    <div className={styles.articleContent}>
        <p>Securing a major project grant is a significant milestone. It signals trust in your idea, your team, and your ability to deliver meaningful results. But winning the funding is only the beginning. What separates successful grantees from those who struggle is not the proposal—it’s how the grant is managed after the award.</p>
        <p>Managing a large grant requires discipline, structure, and accountability. Funders expect you to deliver exactly what was promised, within the agreed timeline and budget, while maintaining clear records and measurable outcomes.</p>
        <p>This guide outlines the essential principles and practices for managing your first major project grant effectively.</p>

        <h3>1. Start by Understanding Your Grant Agreement</h3>
        <p>Before spending any funds, carefully review the grant agreement or award letter. This document is legally binding and defines what you can and cannot do with the funding.</p>
        <p>Key areas to pay close attention to include:</p>
        <ul>
            <li><strong>Scope of work:</strong> What activities are approved</li>
            <li><strong>Budget restrictions:</strong> What costs are allowable or disallowed</li>
            <li><strong>Reporting requirements:</strong> What reports are required and when</li>
            <li><strong>Payment structure:</strong> Lump sum, milestone-based, or reimbursement</li>
            <li><strong>Compliance conditions:</strong> Procurement rules, audit rights, or legal obligations</li>
        </ul>
        <p>Many funders strictly enforce these terms. Spending outside approved categories or missing reporting deadlines can lead to penalties, funding withdrawal, or disqualification from future opportunities.</p>

        <h3>2. Set Up a Clear Project Structure Immediately</h3>
        <p>One of the most common mistakes first-time grantees make is treating a funded project informally. A grant-funded project should be managed like a professional operation from day one.</p>
        <p>Start by establishing:</p>
        <ul>
            <li>A project plan with clear phases and milestones</li>
            <li>Defined roles and responsibilities for everyone involved</li>
            <li>A realistic timeline aligned with grant deadlines</li>
            <li>A system for tracking tasks and deliverables</li>
        </ul>
        <p>Even if your team is small, clarity is critical. Everyone should know what they are responsible for and how their work contributes to the overall project.</p>

        <h3>3. Create a Dedicated Financial Tracking System</h3>
        <p>Grant funds must be tracked with precision. Most funders require that you demonstrate exactly how the money was spent, often down to receipts and invoices.</p>
        <p>Best practices include:</p>
        <ul>
            <li>Keeping separate accounts or cost centers for the grant</li>
            <li>Recording every expense with supporting documentation</li>
            <li>Matching spending categories to the approved budget</li>
            <li>Monitoring burn rate against the project timeline</li>
        </ul>
        <p>Avoid the temptation to “adjust later.” Poor financial tracking is one of the most common reasons projects fail audits or lose funding.</p>

        <h3>4. Stick to the Approved Budget (and Know When to Request Changes)</h3>
        <p>Your approved budget is not a suggestion—it is part of your agreement with the funder.</p>
        <p>In most cases:</p>
        <ul>
            <li>Funds must be used only for approved categories</li>
            <li>Significant changes require prior written approval</li>
            <li>Overspending in one area cannot always be offset by underspending in another</li>
        </ul>
        <p>If your project evolves, communicate early. Funders are often open to reasonable adjustments, but only when they are informed in advance. Making unauthorized changes is a fast way to damage credibility.</p>

        <h3>5. Monitor Progress Against Deliverables</h3>
        <p>Every grant is awarded based on expected outcomes. You need to consistently track whether your project is delivering what was promised.</p>
        <p>This involves:</p>
        <ul>
            <li>Comparing actual progress against milestones</li>
            <li>Tracking key performance indicators (KPIs)</li>
            <li>Identifying risks or delays early</li>
            <li>Adjusting execution while staying within scope</li>
        </ul>
        <p>Do not wait until reporting deadlines to assess progress. Ongoing monitoring ensures you stay in control of the project and avoid last-minute surprises.</p>

        <h3>6. Maintain Strong Documentation at All Times</h3>
        <p>Documentation is not optional in grant management—it is essential.</p>
        <p>You should maintain organized records of:</p>
        <ul>
            <li>Contracts and agreements</li>
            <li>Financial documents (receipts, invoices, payroll records)</li>
            <li>Project outputs and deliverables</li>
            <li>Meeting notes and decisions</li>
            <li>Communications with the funder</li>
        </ul>
        <p>Good documentation protects you during audits, supports your reports, and demonstrates professionalism. If something is not documented, it is often treated as if it did not happen.</p>

        <h3>7. Communicate Proactively with the Funder</h3>
        <p>Funders are not just sources of money—they are stakeholders in your project’s success.</p>
        <p>Strong communication includes:</p>
        <ul>
            <li>Submitting reports on time</li>
            <li>Providing clear and honest updates</li>
            <li>Highlighting achievements and milestones</li>
            <li>Flagging challenges early, not after they escalate</li>
        </ul>
        <p>Transparency builds trust. If issues arise—and they often do—funders are more likely to support you if you have been open and proactive.</p>

        <h3>8. Prepare High-Quality Reports</h3>
        <p>Most grants require periodic progress reports and a final report. These are not just administrative tasks—they are how funders evaluate your performance.</p>
        <p>A strong report typically includes:</p>
        <ul>
            <li>Summary of activities completed</li>
            <li>Progress against objectives and outcomes</li>
            <li>Financial expenditure breakdown</li>
            <li>Evidence of impact (data, case studies, or outputs)</li>
            <li>Explanation of any deviations from the plan</li>
        </ul>
        <p>Well-prepared reports reinforce your credibility and improve your chances of securing future funding.</p>

        <h3>9. Plan for Risk and Flexibility</h3>
        <p>Even well-planned projects encounter challenges. Delays, cost changes, or external factors can affect delivery.</p>
        <p>Effective grant management includes:</p>
        <ul>
            <li>Identifying potential risks early</li>
            <li>Building contingency plans</li>
            <li>Adjusting timelines where necessary</li>
            <li>Keeping the funder informed of significant changes</li>
        </ul>
        <p>The goal is not to avoid all problems—it is to manage them responsibly and transparently.</p>

        <h3>10. Close the Grant Properly</h3>
        <p>The end of the project is just as important as the beginning.</p>
        <p>Grant close-out typically involves:</p>
        <ul>
            <li>Submitting the final report</li>
            <li>Reconciling all financial records</li>
            <li>Ensuring all funds were used appropriately</li>
            <li>Delivering any final outputs or deliverables</li>
            <li>Retaining records for future audits (as required by the funder)</li>
        </ul>
        <p>A well-managed close-out leaves a strong final impression and positions you for future opportunities.</p>

        <h3>Final Thoughts</h3>
        <p>Managing your first big project grant is a shift from idea execution to accountable delivery.</p>
        <p>Success comes down to a few core principles:</p>
        <ul>
            <li>Understand the rules</li>
            <li>Stay organized</li>
            <li>Track everything</li>
            <li>Communicate clearly</li>
            <li>Deliver what you promised</li>
        </ul>
        <p>Done right, your first grant does more than fund a project—it builds your reputation as a reliable partner. That reputation is what opens the door to larger funding opportunities, stronger partnerships, and long-term growth.</p>
        <p>Handle it well, and this won’t be your last big grant—it’ll be your stepping stone to many more.</p>
    </div>
);

const navigatingVisasContent = (
    <div className={styles.articleContent}>
        <p>Working across borders opens up major opportunities—but it also introduces one of the most important (and often misunderstood) barriers: immigration and visa requirements.</p>
        <p>If you get this part wrong, the job offer doesn’t matter. You won’t be allowed to work legally.</p>
        <p>This guide breaks down how visa systems actually work, what employers expect, and how to position yourself properly when pursuing international roles.</p>

        <h3>1. Understand the Two Core Work Visa Models</h3>
        <p>Most countries structure work visas in one of two ways:</p>

        <h4>Employer-Sponsored Work Visas</h4>
        <p>This is the most common route.</p>
        <p>In this model:</p>
        <ul>
            <li>You must have a job offer first</li>
            <li>The employer sponsors your visa</li>
            <li>The employer often proves they couldn’t easily hire a local candidate</li>
        </ul>
        <p>Examples include:</p>
        <ul>
            <li>UK Skilled Worker visa</li>
            <li>US H-1B visa</li>
            <li>Canada’s employer-specific work permits</li>
        </ul>
        <p>These visas are tied to the employer, meaning:</p>
        <ul>
            <li>You usually cannot switch jobs freely</li>
            <li>If you leave the role, your visa status may be affected</li>
        </ul>

        <h4>Independent or Points-Based Visas</h4>
        <p>Some countries allow individuals to apply without a job offer.</p>
        <p>These systems assess:</p>
        <ul>
            <li>Education</li>
            <li>Work experience</li>
            <li>Language ability</li>
            <li>Age</li>
            <li>Skills demand</li>
        </ul>
        <p>Examples include:</p>
        <ul>
            <li>Canada Express Entry</li>
            <li>Australia Skilled Independent visa</li>
        </ul>
        <p>These visas offer more flexibility because:</p>
        <ul>
            <li>You are not tied to a single employer</li>
            <li>You can work across companies once approved</li>
        </ul>

        <h3>2. Sponsorship Is the Biggest Gatekeeper</h3>
        <p>Here’s the reality most people don’t say clearly:</p>
        <div className={styles.tipBox}>
            <strong>👉 Getting an employer to sponsor you is often the hardest part.</strong>
        </div>
        <p>Why?</p>
        <p>Because employers must:</p>
        <ul>
            <li>Handle immigration paperwork</li>
            <li>Pay sponsorship fees (in many countries)</li>
            <li>Meet legal compliance requirements</li>
            <li>Sometimes prove no suitable local candidate exists</li>
        </ul>
        <p>This means companies are selective about who they sponsor.</p>
        <p>What employers look for:</p>
        <ul>
            <li>Specialised or hard-to-find skills</li>
            <li>Strong experience (you’re not entry-level)</li>
            <li>Clear value that outweighs sponsorship cost</li>
        </ul>
        <p>For you—given your QA + oil &amp; gas + product mindset—you’re actually in a better position than most. But you still need to present yourself as “worth the visa”, not just “qualified.”</p>

        <h3>3. Every Country Has Non-Negotiable Eligibility Rules</h3>
        <p>Visa approval is not subjective—it’s rule-based.</p>
        <p>Typical requirements include:</p>
        <ul>
            <li>Valid job offer (for sponsored routes)</li>
            <li>Minimum salary thresholds (e.g., UK Skilled Worker has salary requirements)</li>
            <li>Proof of qualifications or experience</li>
            <li>English or local language proficiency (e.g., IELTS for UK, Canada)</li>
            <li>Criminal record checks</li>
            <li>Health checks (in some countries)</li>
        </ul>
        <p>If you don’t meet the baseline criteria, the application will be refused—no matter how good your CV is.</p>

        <h3>4. Salary Thresholds Matter More Than People Think</h3>
        <p>Many countries set minimum salary requirements for work visas.</p>
        <p>For example:</p>
        <ul>
            <li>In the UK, the Skilled Worker visa has a minimum salary threshold (with some variation depending on role and shortage occupations)</li>
            <li>Canada and Australia also assess whether wages meet local standards</li>
        </ul>
        <p>This creates a practical constraint:</p>
        <div className={styles.tipBox}>
            <strong>👉 If the job salary is too low, you cannot get the visa, even if the employer wants you.</strong>
        </div>
        <p>This is why targeting higher-value roles is critical when aiming to relocate.</p>

        <h3>5. Timing and Processing Can Make or Break Opportunities</h3>
        <p>Visa timelines are not instant.</p>
        <p>Processing can take:</p>
        <ul>
            <li>A few weeks (fast-track cases)</li>
            <li>Several months (standard routes)</li>
        </ul>
        <p>Some visas also have:</p>
        <ul>
            <li>Annual caps (e.g., US H-1B lottery system)</li>
            <li>Application windows</li>
            <li>Employer registration requirements</li>
        </ul>
        <p>This affects hiring decisions. Many employers prefer candidates who:</p>
        <ul>
            <li>Already have work authorization</li>
            <li>Or can relocate quickly</li>
        </ul>
        <p>Understanding timelines helps you:</p>
        <ul>
            <li>Set realistic expectations</li>
            <li>Communicate clearly with employers</li>
            <li>Avoid losing offers due to delays</li>
        </ul>

        <h3>6. Documents Must Be Precise and Verifiable</h3>
        <p>Visa applications rely heavily on documentation. Common requirements include:</p>
        <ul>
            <li>Passport and identification documents</li>
            <li>Employment contracts</li>
            <li>Proof of qualifications (degrees, certifications)</li>
            <li>Work history evidence</li>
            <li>Financial proof (for some visa types)</li>
            <li>English test results (if required)</li>
        </ul>
        <p>Errors, inconsistencies, or missing documents are one of the most common reasons for delays or refusals.</p>
        <p>Accuracy matters. Everything must align.</p>

        <h3>7. Remote Work Is Not a Loophole</h3>
        <p>A common misconception is that remote jobs eliminate visa requirements.</p>
        <p>They don’t.</p>
        <p>If you are:</p>
        <ul>
            <li>Living in a country</li>
            <li>And working (even remotely)</li>
        </ul>
        <p>You may still need:</p>
        <ul>
            <li>Legal work authorization</li>
            <li>Tax compliance</li>
            <li>Residency permissions</li>
        </ul>
        <p>Some countries now offer digital nomad visas, but these have their own rules and limitations.</p>

        <h3>8. Immigration Rules Change Frequently</h3>
        <p>Visa policies are not static.</p>
        <p>Governments regularly adjust:</p>
        <ul>
            <li>Eligibility criteria</li>
            <li>Salary thresholds</li>
            <li>Occupation shortage lists</li>
            <li>Processing rules</li>
        </ul>
        <p>What worked last year may not apply today.</p>
        <p>This means you should always:</p>
        <ul>
            <li>Check official government sources</li>
            <li>Avoid relying on outdated advice</li>
            <li>Confirm details before applying</li>
        </ul>

        <h3>9. Position Yourself Strategically for International Roles</h3>
        <p>If you’re serious about working internationally, don’t approach it randomly.</p>
        <p>Be deliberate.</p>
        <p>Focus on:</p>
        <ul>
            <li>Roles in shortage occupations</li>
            <li>Companies known to sponsor visas</li>
            <li>Skills that are globally transferable</li>
            <li>Higher-paying roles that meet visa thresholds</li>
        </ul>
        <p>Adjust your positioning:</p>
        <ul>
            <li>Make your CV clearly international</li>
            <li>Highlight measurable impact</li>
            <li>Emphasize specialised expertise</li>
        </ul>
        <p>You’re not just applying for a job—you’re justifying immigration approval.</p>

        <h3>10. Consider Alternative Entry Routes</h3>
        <p>If direct sponsorship is difficult, there are other pathways:</p>
        <ul>
            <li>Study routes leading to post-study work visas</li>
            <li>Internal company transfers (working for a global company first)</li>
            <li>Short-term contracts or secondments</li>
            <li>Skilled migration programs (points-based systems)</li>
        </ul>
        <p>Sometimes the fastest way in is not the most obvious one.</p>

        <h3>Final Thoughts</h3>
        <p>Navigating visa requirements is not about guesswork—it’s about understanding the system and playing it properly.</p>
        <p>At its core:</p>
        <ul>
            <li>Visas are rule-based, not opinion-based</li>
            <li>Employers must justify hiring you internationally</li>
            <li>You must meet strict eligibility criteria</li>
        </ul>
        <p>If you align your skills, job targets, and application strategy with how immigration systems actually work, your chances increase significantly.</p>
        <p>Approach it strategically, and international roles stop feeling out of reach—they become a process you can manage and win.</p>
    </div>
);

export default function ResourcesPage() {
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    const articles: Article[] = [
        { cat: 'Guidance', title: 'How to spot remote work scams before applying', desc: 'Protect yourself with these 5 red flags common in online job postings.', icon: '🛡️', content: howToSpotScamsContent },
        { cat: 'Tips', title: '5 elements every winning grant essay has', desc: 'Practical advice from reviewers on how to make your application stand out.', icon: '✍️', content: fiveElementsContent },
        { cat: 'Explainers', title: 'Understanding fellowships vs. standard grants', desc: 'Clear up the confusion between different types of funding structures.', icon: '🧭', content: understandingFellowshipsContent },
        { cat: 'Career', title: 'The ultimate guide to cold-emailing recruiters', desc: 'Templates and strategies to get responses from busy hiring managers.', icon: '📧', content: coldEmailingRecruitersContent },
        { cat: 'Finance', title: 'Managing your first big project grant', desc: 'Step-by-step breakdown on budgeting and reporting for research funds.', icon: '📊', content: managingFirstBigGrantContent },
        { cat: 'Guidance', title: 'Navigating visa requirements for international roles', desc: 'A practical explainer on what to expect when applying abroad.', icon: '🌎', content: navigatingVisasContent },
    ];

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-body)' }}>
            <header className={styles.header}>
                <div className="container">
                    <h1 className={styles.title}>Media & Resources Hub</h1>
                    <p className={styles.subtitle}>
                        Practical advice, explainers, and guidance to help you secure the bag and build your career safely.
                    </p>
                </div>
            </header>

            <main className="container">
                <div className={styles.grid}>
                    {articles.map((article) => (
                        <article
                            key={article.title}
                            className={styles.card}
                            onClick={() => setSelectedArticle(article)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className={styles.image}>{article.icon}</div>
                            <div className={styles.content}>
                                <span className={styles.category}>{article.cat}</span>
                                <h3 className={styles.cardTitle}>{article.title}</h3>
                                <p className={styles.cardDesc}>{article.desc}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </main>

            {selectedArticle && (
                <div className={styles.modalBackdrop} onClick={() => setSelectedArticle(null)}>
                    <div className={styles.modalContainer} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <div>
                                <span className={styles.category} style={{ marginBottom: '0.5rem' }}>{selectedArticle.cat}</span>
                                <h2 className={styles.modalTitle}>{selectedArticle.title}</h2>
                            </div>
                            <button className={styles.closeBtn} onClick={() => setSelectedArticle(null)}>
                                &times;
                            </button>
                        </div>
                        <div className={styles.modalScrollArea}>
                            {selectedArticle.content ? selectedArticle.content : (
                                <p style={{ color: 'var(--text-muted)' }}>Full article content is not yet available for this entry.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
