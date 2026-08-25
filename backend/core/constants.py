# Logged in user placeholder
logged_in_user = {
    "department": "HR",
    "country": "India",
    "location": "Chennai",
    "access_level": "Employee"
}

# HR Categories
HR_CATEGORIES = [
    "Leave Policy",
    "Attendance",
    "Payroll",
    "Travel",
    "Insurance",
    "Employee Benefits",
    "Performance",
    "Recruitment",
    "Learning",
    "Onboarding",
    "Exit",
    "OutOfScope"
]

# HR Query Intents
INTENTS = [
    "Information",
    "Eligibility",
    "Procedure",
    "Comparison",
    "Policy",
    "Document",
    "Unknown"
]

# Rule-Based Intent Keywords
RULE_BASED_INTENTS = {
    "GREETING": [
        "hi",
        "hello",
        "hey",
        "good morning",
        "good afternoon",
        "good evening"
    ],
    "GOODBYE": [
        "bye",
        "thanks",
        "thank you",
        "see you"
    ]
}

# Intent Examples for Semantic Intent Vectors
INTENT_EXAMPLES = {
    "GREETING": [
        "hi",
        "hello",
        "hey",
        "good morning",
        "good afternoon",
        "good evening"
    ],
    "GOODBYE": [
        "bye",
        "thank you",
        "thanks",
        "see you"
    ],
    "CHECK_BALANCE": [
        "leave balance",
        "remaining leave",
        "available leave",
        "vacation balance",
        "annual leave remaining",
        "how many leaves do i have"
    ],
    "PAYSLIP": [
        "salary slip",
        "pay slip",
        "monthly payslip",
        "download payslip",
        "salary statement"
    ],
    "DOWNLOAD_DOCUMENT": [
        "download leave policy",
        "download pdf",
        "employee handbook",
        "leave form",
        "travel policy pdf"
    ],
    "APPLY_LEAVE": [
        "apply leave",
        "leave request",
        "book vacation",
        "request annual leave"
    ],
    "RAISE_TICKET": [
        "raise complaint",
        "report issue",
        "technical problem",
        "need support"
    ]
}

# Follow-up Question Keywords
FOLLOWUP_PATTERNS = [
    "it",
    "its",
    "this",
    "that",
    "these",
    "those",
    "they",
    "them",
    "same",
    "also",
    "another",
    "again",
    "earlier",
    "previous",
    "above",
    "how many",
    "how much",
    "what about",
    "what if",
    "can i",
    "does this",
    "is this"
]

# Query Rewrite Rules
QUERY_REWRITE_RULES = {
    "wfh": "Work From Home (WFH)",
    "pto": "Paid Time Off (PTO)",
    "sl": "Sick Leave (SL)",
    "al": "Annual Leave (AL)",
    "cl": "Casual Leave (CL)",
    "lop": "Loss Of Pay (LOP)",
    "late coming": "Late Attendance",
    "insurance": "Employee Insurance"
}

# Canonical Queries Map
CANONICAL_QUERIES = {
    "Leave Policy": [
        {
            "patterns": [
                "sick leave",
                "sl"
            ],
            "canonical":
            "Maximum Sick Leave entitlement per calendar year"
        },
        {
            "patterns": [
                "casual leave",
                "cl"
            ],
            "canonical":
            "Maximum Casual Leave entitlement per calendar year"
        },
        {
            "patterns": [
                "annual leave",
                "al"
            ],
            "canonical":
            "Maximum Annual Leave entitlement per calendar year"
        }
    ],
    "Attendance": [
        {
            "patterns": [
                "late attendance",
                "late coming"
            ],
            "canonical":
            "Late Attendance policy"
        }
    ]
}

AMBIGUOUS_WORDS = {
    "it",
    "this",
    "that",
    "those",
    "these",
    "they",
    "them"
}

BLOCKED_KEYWORDS = [
    "ignore previous instructions",
    "forget previous instructions",
    "system prompt",
    "show system prompt",
    "developer message",
    "reveal prompt",
    "bypass",
    "jailbreak",
    "act as",
    "pretend you are",
    "ignore all",
    "disable",
    "root access"
]

SQL_KEYWORDS = [
    "drop table",
    "delete from",
    "truncate",
    "insert into",
    "update ",
    "union select",
    "--"
]
