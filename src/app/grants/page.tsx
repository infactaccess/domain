'use client';

import { useState } from 'react';
import styles from './page.module.css';

const GRANTS = [
    {
        id: 1,
        name: "The SME Mall Women in Business Grant Competition",
        description: "The SME Mall offers comprehensive grant support specifically for female entrepreneurs, combining financial assistance with business advisory services. The program focuses on women-led businesses with proven market traction and clear expansion plans, providing both capital and strategic guidance through a rigorous selection process.",
        amount: "Varies by business stage and needs",
        target: "Women-led businesses with growth potential"
    },
    {
        id: 2,
        name: "Tony Elumelu Foundation (TEF)",
        description: "Africa’s largest entrepreneurship program provides $5,000 seed capital plus comprehensive business training, mentorship, and access to global networks. The program emphasizes scalable businesses with job creation potential across various sectors including technology, agriculture, and manufacturing.",
        amount: "$5,000 per entrepreneur",
        target: "African entrepreneurs with businesses under 5 years"
    },
    {
        id: 3,
        name: "SMEDAN Conditional Grant Scheme",
        description: "The Small and Medium Enterprises Development Agency operates accessible grant programs for micro enterprises, providing direct financial support plus comprehensive business development training, market access facilitation, and ongoing mentorship nationwide.",
        amount: "₦50,000 for micro enterprises",
        focus: "Micro enterprise development and formalization"
    },
    {
        id: 4,
        name: "FGN-ALAT Digital Skillnovation Program",
        description: "This program combines digital skills training with grant funding for technology-focused startups and SMEs. Participants receive comprehensive training in digital marketing, e-commerce development, and technology implementation alongside financial support.",
        target: "Tech startups and digital businesses",
        support: "Grants plus skills development"
    },
    {
        id: 5,
        name: "Lagos State Employment Trust Fund (LSETF)",
        description: "LSETF operates comprehensive employment generation programs combining funding with intensive business development support. The fund runs sector-specific bootcamps providing skills training before grant access, with emphasis on job creation and youth empowerment.",
        range: "₦500,000 – ₦5 million",
        location: "Lagos State only"
    },
    {
        id: 6,
        name: "Mastercard Foundation Programs",
        description: "Africa’s largest private foundation focuses on financial inclusion and youth economic empowerment, providing substantial funding plus access to global networks, technical expertise, and ongoing strategic support for businesses creating jobs for young people.",
        range: "$500,000 – $2,500,000",
        focus: "Financial inclusion, youth empowerment"
    },
    {
        id: 7,
        name: "Google for Startups Accelerator Africa",
        description: "Google’s prestigious technology accelerator provides intensive mentorship, funding, and access to Google’s global resources. Participants receive support from Google engineers, substantial Cloud credits, and access to international investor networks.",
        duration: "3 months intensive program",
        target: "Early-stage technology startups"
    },
    {
        id: 8,
        name: "Presidential Conditional Grant Scheme",
        description: "Federal government flagship program representing Nigeria’s most significant direct investment in small business development. The program focuses on businesses with clear job creation potential and operates through a comprehensive national framework.",
        requirement: "Clear job creation commitment",
        coverage: "Nationwide program"
    },
    {
        id: 9,
        name: "Nigerian Content Development and Monitoring Board (NCDMB)",
        description: "NCDMB operates specialized programs for Nigeria’s oil and gas sector, focusing on building local content capacity through comprehensive business development, technical training, and partnerships with international companies.",
        sector: "Oil and gas industry",
        focus: "Local content development"
    },
    {
        id: 10,
        name: "Development Bank of Nigeria (DBN)",
        description: "DBN operates as Nigeria’s wholesale development finance institution, working through partner banks to expand MSME access to long-term financing. Programs include capacity building, risk-sharing arrangements, and technical assistance.",
        model: "Wholesale funding through partner banks",
        access: "Through participating financial institutions"
    },
    {
        id: 11,
        name: "Federal Ministry of Science, Technology and Innovation (FMSTI)",
        description: "FMSTI supports science, technology, and innovation-driven businesses through funding for research and development, prototype development, and commercialization of innovative technologies addressing Nigeria’s development challenges.",
        focus: "Science, technology, innovation",
        target: "Tech startups, innovators, research-based businesses"
    },
    {
        id: 12,
        name: "Bet9ja Foundation Grant",
        description: "Bet9ja Foundation operates comprehensive entrepreneurship support programs for promising Nigerian entrepreneurs across diverse sectors, emphasizing businesses with social impact components and significant job creation potential.",
        focus: "Entrepreneurial development with social impact",
        target: "Nigerian entrepreneurs across multiple sectors"
    },
    {
        id: 13,
        name: "Nigeria Youth Futures Fund",
        description: "Specialized program addressing youth unemployment through comprehensive entrepreneurship support for young Nigerians aged 18-35. The fund emphasizes technology-enabled businesses, creative industries, and agriculture value chain businesses.",
        target: "Youth entrepreneurs aged 18-35",
        focus: "Job creation, innovation, economic empowerment",
        support: "Grants, training, mentorship, market access"
    },
    {
        id: 14,
        name: "Federal Ministry of Industry, Trade and Investment (FMITI)",
        description: "FMITI operates comprehensive MSME support programs including grants, training, market access support, and policy advocacy. Programs include international trade facilitation, export development support, and partnerships with foreign investors.",
        services: "Grants, training, market access, policy advocacy",
        coverage: "Multiple sectors with manufacturing emphasis"
    },
    {
        id: 15,
        name: "Nigerian Association of Small-Scale Industrialists (NASSI)",
        description: "Nigeria’s oldest small-scale industries association operates programs combining funding with business development and advocacy services. NASSI provides market access, technology, training, and policy advocacy for small manufacturers nationwide.",
        coverage: "All 36 states",
        sponsors: "SME Scale-Up and Seven-up bottling company"
    }
];

export default function GrantsPage() {
    const [openId, setOpenId] = useState<number | null>(null);

    const toggleAccordion = (id: number) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <h1 className={styles.title}>Grants & Funding Opportunities</h1>
                <p className={styles.subtitle}>
                    Access real funding opportunities designed to support individuals, startups, and growing businesses.
                </p>
            </section>

            {/* Intro Body Copy */}
            <section className={styles.section}>
                <div className="card">
                    <p className={styles.bodyCopy}>
                        We help entrepreneurs, SMEs, and organisations discover verified grant opportunities and guide them through the process of successfully applying for them. Our platform curates non-repayable funding programs provided by governments, private foundations, and international development organisations.
                    </p>
                    <p className={styles.bodyCopy}>
                        Unlike loans, grants do not need to be repaid. They are designed to stimulate economic growth, encourage innovation, and empower communities by providing financial support to promising ideas and impactful businesses.
                    </p>
                </div>
            </section>

            {/* What We Do */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>What We Do</h2>
                <div className={styles.grid3}>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>1. Grant Discovery</h3>
                        <p className={styles.cardText}>
                            We continuously identify and publish legitimate funding opportunities available to individuals, startups, SMEs, and NGOs.
                        </p>
                    </div>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>2. Application Guidance</h3>
                        <p className={styles.cardText}>
                            Many applicants miss out on grants simply because they don’t understand the process. We provide practical guidance on eligibility requirements, documentation, and application strategy to help you submit stronger applications.
                        </p>
                    </div>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>3. Success Support</h3>
                        <p className={styles.cardText}>
                            From preparing your application to understanding evaluation criteria, we help position you for a better chance of securing funding.
                        </p>
                    </div>
                </div>
            </section>

            {/* Types of Grants */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Types of Grants We Provide Access To</h2>
                <p className={styles.introLine}>
                    Our funding opportunities span several sectors and development initiatives, including:
                </p>
                <div className={styles.grid2}>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>1. Entrepreneurship & Seed Grants</h3>
                        <p className={styles.cardText}>
                            Programs that support early-stage businesses and new entrepreneurs with startup capital.
                            Examples include initiatives like the Tony Elumelu Foundation (TEF) entrepreneurship programs.
                        </p>
                    </div>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>2. Women-Focused Grants</h3>
                        <p className={styles.cardText}>
                            Funding designed specifically to empower women entrepreneurs and female-led businesses.
                        </p>
                    </div>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>3. Agribusiness Grants</h3>
                        <p className={styles.cardText}>
                            Financial support for agricultural ventures, food production, agritech innovation, and rural development.
                        </p>
                    </div>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>4. Technology & Innovation Grants</h3>
                        <p className={styles.cardText}>
                            Programs aimed at supporting startups developing technology solutions, digital platforms, and innovative products.
                        </p>
                    </div>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>5. Government Development Programs</h3>
                        <p className={styles.cardText}>
                            Government-backed funding initiatives supporting SMEs and business development, including programs similar to those run by agencies such as SMEDAN.
                        </p>
                    </div>
                </div>
            </section>

            {/* Who This Is For */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Who This Is For</h2>
                <p className={styles.introLine}>
                    Our grant opportunities are suitable for:
                </p>
                <ul className={styles.bulletList}>
                    <li>Entrepreneurs launching new ventures</li>
                    <li>Small and medium-sized businesses seeking growth capital</li>
                    <li>Startups building innovative solutions</li>
                    <li>NGOs and social impact organisations</li>
                    <li>Individuals with scalable business or community projects</li>
                </ul>
            </section>

            {/* Why Use Our Platform */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Why Use Our Platform</h2>
                <div className="card">
                    <p className={styles.bodyCopy}>
                        Finding genuine grants can be difficult. Many opportunities are scattered across different organisations and platforms.
                    </p>
                    <p className={styles.bodyCopy}>
                        We simplify the process by bringing verified funding opportunities into one place, while providing clear guidance that helps applicants avoid common mistakes and increase their chances of success.
                    </p>
                    <p className={styles.bodyCopy}>
                        Our goal is simple: help more people access funding that supports business growth, innovation, and community development.
                    </p>
                </div>
            </section>

            {/* Available Grants Accordion */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Current List of Available Grants in Nigeria</h2>
                <div className={styles.accordion}>
                    {GRANTS.map((grant) => {
                        const isOpen = openId === grant.id;
                        return (
                            <div key={grant.id} className={styles.accordionItem}>
                                <button
                                    className={styles.accordionTrigger}
                                    onClick={() => toggleAccordion(grant.id)}
                                    data-state={isOpen ? 'open' : 'closed'}
                                    aria-expanded={isOpen}
                                >
                                    <span>{grant.name}</span>
                                    <span className={styles.accordionIcon}>▼</span>
                                </button>
                                <div
                                    className={styles.accordionContent}
                                    data-state={isOpen ? 'open' : 'closed'}
                                >
                                    <p className={styles.accordionText}>{grant.description}</p>
                                    <div className={styles.accordionMeta}>
                                        {grant.amount && <span className={styles.metaBadge}>Amount: {grant.amount}</span>}
                                        {grant.range && <span className={styles.metaBadge}>Range: {grant.range}</span>}
                                        {grant.target && <span className={styles.metaBadge}>Target: {grant.target}</span>}
                                        {grant.focus && <span className={styles.metaBadge}>Focus: {grant.focus}</span>}
                                        {grant.support && <span className={styles.metaBadge}>Support: {grant.support}</span>}
                                        {grant.location && <span className={styles.metaBadge}>Location: {grant.location}</span>}
                                        {grant.duration && <span className={styles.metaBadge}>Duration: {grant.duration}</span>}
                                        {grant.requirement && <span className={styles.metaBadge}>Requirement: {grant.requirement}</span>}
                                        {grant.coverage && <span className={styles.metaBadge}>Coverage: {grant.coverage}</span>}
                                        {grant.sector && <span className={styles.metaBadge}>Sector: {grant.sector}</span>}
                                        {grant.model && <span className={styles.metaBadge}>Model: {grant.model}</span>}
                                        {grant.access && <span className={styles.metaBadge}>Access: {grant.access}</span>}
                                        {grant.services && <span className={styles.metaBadge}>Services: {grant.services}</span>}
                                        {grant.sponsors && <span className={styles.metaBadge}>Sponsors: {grant.sponsors}</span>}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Facebook CTA */}
            <section className={styles.ctaCard}>
                <p className={styles.ctaText}>
                    Follow our Facebook channel to stay informed about newly available grants, funding alerts, application deadlines, and practical guidance that can help you apply successfully without unnecessary hassle.
                </p>
            </section>
        </div>
    );
}
