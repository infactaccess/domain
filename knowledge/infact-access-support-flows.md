---
title: Infact Access Support Flows
slug: infact-access-support-flows
category: support_kb
tags: support, onboarding, signup, dashboard, navigator, truthline, bintu, troubleshooting, members
source_url: internal://knowledge/infact-access-support-flows
---

# Infact Access Support Flows

## Document Purpose

### Metadata Labels
- doc_type: support_knowledge_base
- audience: users, members, support
- priority: high
- canonical_voice: first_person_plural

This document is the support-focused companion to our business knowledge base. It explains how users move through core product flows, what they should expect, and how to troubleshoot common issues in a practical way.

When Bintu answers support questions, it should use this document together with the business knowledge base so answers remain both accurate and operationally useful.

## Sign-Up And Sign-In Flow

### Metadata Labels
- topic: auth
- feature: signup
- audience: users, support
- priority: high

### What Users Can Do
Users can:
- Create a new account
- Sign in to an existing account

### Information Collected During Sign-Up
Our sign-up form currently collects:
- First name
- Last name
- Phone number
- Email address
- City
- State
- Password

The sign-up flow is built around Nigerian states, so the current user onboarding experience is clearly localized for Nigeria.

### Password Requirements
Passwords must meet a minimum standard. The app checks for:
- At least 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 symbol

The sign-up form also asks the user to confirm the password. If the two password entries do not match, account creation should not proceed.

### What Happens After Sign-Up
After a successful sign-up attempt, the product tells the user to check their email, confirm the account, and then sign in.

### Common Sign-Up Issues
Common sign-up issues include:
- Password does not meet the minimum standard
- Password and confirm password do not match
- Required fields are missing
- Email confirmation has not been completed yet

### Support Guidance For Bintu
If a user says sign-up is not working, Bintu should guide them through:
1. Checking whether all fields were completed
2. Verifying that the password meets the required standard
3. Confirming that both password fields match
4. Checking email for an account confirmation message
5. Trying sign-in only after confirmation is complete

Bintu should not claim account confirmation succeeded unless the user confirms it.

## Profile And Account Sync

### Metadata Labels
- topic: profile
- feature: account_sync
- audience: members, support
- priority: medium

### What Happens After Authentication
When a user signs in successfully, our app attempts to sync profile information from account metadata into the member profile record.

Profile-related fields can include:
- Email
- Full name
- First name
- Last name
- Phone number
- City
- State

### Support Guidance
If a user says their name or profile details are missing, Bintu should explain that profile details are derived from the information supplied during sign-up and synced into the profile record after authentication.

## Dashboard Usage

### Metadata Labels
- topic: dashboard
- feature: dashboard
- audience: members, support
- priority: high

### What The Dashboard Is For
The Membership Dashboard is our member area for viewing saved or matched content, quick actions, and selected resources.

### What Users May See On The Dashboard
The dashboard can show:
- Matching opportunities
- Saved opportunities
- Upcoming deadlines
- Resource counts
- Quick actions to other tools

### Quick Actions Available
The dashboard currently links users to:
- Browse All Opportunities
- Use the Navigator
- TruthLine
- Grants
- Ask Bintu

### Why A Dashboard May Look Empty
A dashboard may look empty because:
- The user has not saved any opportunities yet
- The user has not used the Navigator to generate matches
- No saved opportunity records are currently linked to the account
- The dashboard is in a guest-like or minimal state before meaningful member activity

### Support Guidance For Empty Dashboard Questions
If a user says their dashboard is empty, Bintu should explain:
- Saved opportunities only appear after the user saves them
- Matching opportunities are tied to saved or matched records, not just general browsing
- The user may need to use the Navigator or save opportunities first

Bintu should avoid promising hidden opportunities that are not present in the account.

## Saving Opportunities

### Metadata Labels
- topic: saved_opportunities
- feature: dashboard
- audience: members, support
- priority: high

### How Saving Works
Members can save opportunities from supported flows. In the current product, the clearest save flow is through Opportunity Navigator job matches.

When a user saves matches:
- Opportunity records are written into the opportunities table if needed
- Saved links are associated with the user profile
- The dashboard can later use those records for display

### Why A Save May Fail
A save may fail because:
- The user is not signed in
- There are no results to save
- The opportunity was already saved
- There was a backend error during the save process

### Support Guidance
If a user cannot save opportunities, Bintu should suggest:
1. Confirming they are signed in
2. Confirming there are actual results on screen
3. Trying the save action again
4. Checking whether the opportunity may already be saved

## Opportunities Browsing Flow

### Metadata Labels
- topic: opportunities
- feature: browse
- audience: users, members, support
- priority: high

### What Users Can Do
In the opportunities section, users can:
- Search by title, role, or company
- Filter by category
- Browse pages of results
- Open the source listing

### What Users Should Expect
The opportunities experience currently centers on live job opportunities. Users should expect browseable job cards with details such as:
- Title
- Organization
- Category
- Description snippet
- Location
- Job type
- Posted date

### Common Browsing Issues
Common issues include:
- No results after applying filters
- Search terms being too narrow
- Live opportunities not loading temporarily

### Support Guidance
If no opportunities appear, Bintu should suggest:
1. Clearing the search term
2. Switching the category back to All
3. Trying fewer filters
4. Reloading the opportunities page later if the live feed is temporarily unavailable

Bintu should not claim that specific jobs still exist unless current results support that claim.

## Opportunity Navigator Flow

### Metadata Labels
- topic: navigator
- feature: navigator
- audience: users, members, support
- priority: high

### What Navigator Does
Opportunity Navigator is our guided question flow that helps users narrow down suitable opportunities.

### Main Paths
The current paths are:
- Grant
- Verified Jobs

### Verified Jobs Flow
If the user selects Verified Jobs, we ask for:
- Experience level
- Preferred industry
- Preferred work location

We then fetch matching results.

### Grant Flow
If the user selects Grant, we ask for:
- Entity type
- Industry or focus area
- Funding level

The current grant path does not end in a saved in-app grant result list. Instead, it directs the user toward our Facebook page for updated grant opportunities and guidance.

### Common Navigator Questions
Users may ask:
- Why am I not getting any matches?
- Why did grants not show actual listings?
- Why can I save job matches but not grant results?

### Troubleshooting Navigator Matches
If a user gets no job matches, Bintu should suggest:
1. Restarting the Navigator
2. Choosing broader options where possible
3. Trying a different work location or industry
4. Using the regular opportunities browse page as a fallback

### Important Support Rule
Bintu should explain the current product reality clearly:
- Verified Jobs can return in-app matches
- Grant selections currently lead users toward our Facebook update path instead of a live matched result list

## TruthLine User Flow

### Metadata Labels
- topic: truthline
- feature: truthline
- audience: members, support
- priority: high

### What A User Needs To Start
To use TruthLine, a member needs:
- An active signed-in session
- A vacancy URL starting with `http://` or `https://`

### What TruthLine Does Step By Step
TruthLine:
1. Accepts the submitted vacancy URL
2. Validates the URL format
3. Rejects invalid or disallowed private-network targets
4. Extracts visible listing content
5. Reviews signals such as structure, employer identity, contacts, routing, and suspicious language
6. Produces a recommendation and trust score

### What A User Will See
After analysis, the user may see:
- Overall recommendation
- Trust score
- Vacancy snapshot
- Verification checklist
- Verified signals
- Risk signals
- Missing information
- Assessment notes
- Before-you-apply next steps

### Common TruthLine Errors
Common problems include:
- Invalid URL entered
- URL does not expose enough job content for analysis
- The listing cannot be fetched or analyzed temporarily

### Support Guidance For TruthLine Problems
If a user says TruthLine failed, Bintu should guide them to:
1. Check that the link starts with `http://` or `https://`
2. Make sure the link points to a live vacancy page, not a private or broken page
3. Try a more direct listing URL if the current one is shortened or redirects oddly
4. Try again later if the analysis service had a temporary failure

### Trust Score Guidance
Bintu should explain that TruthLine's trust score is a practical review signal, not a final guarantee of legitimacy.

## Ask Bintu User Flow

### Metadata Labels
- topic: bintu
- feature: bintu
- audience: members, support
- priority: high

### What Users Can Ask Bintu
Users can ask Bintu about:
- Our mission
- Our platform
- Verified opportunities
- Grants
- Resources
- How our services are meant to work

### What Happens During A Bintu Session
Our app:
- Verifies the user is signed in
- Stores recent conversation context locally for the session experience
- Sends the user's message to the Bintu API
- Retrieves relevant knowledge chunks
- Generates a grounded answer when support is strong
- Falls back when support is weak or out of scope

### Why Bintu May Refuse A Question
Bintu may refuse or narrow an answer because:
- The question falls outside Infact Access scope
- The current knowledge base does not support a reliable answer
- The user is asking for details we have not documented clearly

### Support Guidance
If a user says Bintu is not answering fully, Bintu should explain that it is designed to stay within supported Infact Access knowledge and avoid guessing.

## Broadcast And Update Channels

### Metadata Labels
- topic: channels
- feature: broadcasts
- audience: users, members, support
- priority: medium

### What Users Can Expect
Users may use our update channels to stay aware of:
- Verified opportunity alerts
- Grant updates
- Weekly updates
- Practical guidance content

### Current Channel References
The product references:
- WhatsApp
- Facebook
- Email newsletter
- Instagram

### Support Guidance
If a user asks where to get updates, Bintu should direct them toward the channels currently referenced in the product rather than implying unsupported channel automation.

## Contact Flow

### Metadata Labels
- topic: contact
- feature: contact
- audience: users, support
- priority: medium

### How Contact Works
Users can send a message through the contact form by submitting:
- First name
- Last name
- Email
- Phone number
- Message

### What The User Should Expect
The product states that we typically respond within 24 to 48 business hours.

### Common Contact Issues
Common issues include:
- Missing required fields
- Invalid email format
- Temporary delivery failure

### Support Guidance
If a user says their message did not send, Bintu should suggest:
1. Checking required fields
2. Checking the email address format
3. Trying again later if there was a temporary error

## Newsletter Subscription Flow

### Metadata Labels
- topic: newsletter
- feature: updates
- audience: users, members, support
- priority: medium

### How Subscription Works
Users can subscribe in the footer by entering an email address.

### Expected Success Behavior
On success, the interface shows a subscribed confirmation state.

### Common Problems
Common issues include:
- Invalid email entry
- Temporary database or network failure

### Support Guidance
If the user says subscription did not work, Bintu should explain that the form depends on a working email submission flow and suggest trying again with a valid email address.

## Common Support Scenarios

### Metadata Labels
- topic: troubleshooting
- audience: support, AI
- priority: high

### Scenario: "I signed up but I still cannot log in"
Support answer guidance:
- Confirm whether the account was created successfully
- Ask whether the user completed email confirmation
- Remind them that sign-in may not work until confirmation is complete

### Scenario: "My dashboard is empty"
Support answer guidance:
- Explain that dashboard content is tied to saved and matched records
- Suggest using Navigator and saving opportunities first
- Explain that the dashboard may look minimal before account activity is created

### Scenario: "Navigator did not show grant listings"
Support answer guidance:
- Explain that the current grant path does not yet return a live in-app matched listings experience
- Direct the user to the Facebook grant update path mentioned in the product

### Scenario: "TruthLine says the listing could not be reviewed"
Support answer guidance:
- Explain that the page may not have exposed enough vacancy content
- Suggest using a more direct listing URL
- Suggest trying again later if the service had a temporary error

### Scenario: "Bintu answered in a limited way"
Support answer guidance:
- Explain that Bintu stays within supported Infact Access knowledge
- Clarify that it avoids guessing when the available knowledge is incomplete

## Answering Rules For Support Questions

### Metadata Labels
- topic: answering_rules
- audience: AI
- priority: high

When answering support-style questions:
- Use first-person business language such as "we", "our", and "us"
- Be practical and action-oriented
- Keep steps simple and sequential
- Do not invent missing policies or hidden internal processes
- Distinguish clearly between what users can do now and what the product does not yet do
- Do not overstate the grants flow or the verification model

## Final Summary

### Metadata Labels
- topic: summary
- audience: support, AI
- priority: medium

This support document should be used when questions focus on:
- Signing up
- Signing in
- Account confirmation
- Dashboard behavior
- Saving opportunities
- Using Opportunity Navigator
- Understanding TruthLine
- Understanding Bintu behavior
- Getting updates
- Contacting support

It is especially useful for turning our product behavior into direct user help without guessing or overstating features.
