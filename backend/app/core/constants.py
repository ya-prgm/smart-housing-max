import enum


class UserRole(str, enum.Enum):
    RESIDENT = "resident"
    CHAIRMAN = "chairman"
    UK_STAFF = "uk_staff"


class OwnershipType(str, enum.Enum):
    OWNER = "owner"
    TENANT = "tenant"
    REGISTERED = "registered"


class ManagementType(str, enum.Enum):
    UK = "uk"
    TSZH = "tszh"


class ProviderCategory(str, enum.Enum):
    HEATING = "heating"
    WATER = "water"
    ELECTRICITY = "electricity"
    INTERNET = "internet"
    INTERCOM = "intercom"
    MUNICIPAL = "municipal"


class TicketStatus(str, enum.Enum):
    ACTIVE = "active"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    REJECTED = "rejected"


class TicketPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class RecipientType(str, enum.Enum):
    UK = "uk"
    RSO = "rso"
    GZHI = "gzhi"
    OMS = "oms"


class PollStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class PollQuestionType(str, enum.Enum):
    SINGLE_CHOICE = "single_choice"
    MULTIPLE_CHOICE = "multiple_choice"
    TEXT = "text"


class ReactionType(str, enum.Enum):
    LIKE = "like"
    DISLIKE = "dislike"


class NotificationCategory(str, enum.Enum):
    SYSTEM = "system"
    UK = "uk"
    CHAIRMAN = "chairman"


class PostType(str, enum.Enum):
    ANNOUNCEMENT = "announcement"
    REPORT = "report"
    INFO = "info"
    EMERGENCY = "emergency"


class ActivityType(str, enum.Enum):
    TICKET_CREATED = "ticket_created"
    TICKET_STATUS = "ticket_status"
    POST_PUBLISHED = "post_published"
    POLL_STARTED = "poll_started"
    ROLE_ASSIGNED = "role_assigned"


class JournalAction(str, enum.Enum):
    CREATE = "create"
    UPDATE = "update"
    DELETE = "delete"
    STATUS_CHANGE = "status_change"
    ROLE_CHANGE = "role_change"
    ASSIGN = "assign"


class JournalEntityType(str, enum.Enum):
    TICKET = "ticket"
    POST = "post"
    POLL = "poll"
    USER = "user"
    COMMENT = "comment"
    FILE = "file"


class FileContext(str, enum.Enum):
    TICKET = "ticket"
    FEED = "feed"
    DOCUMENT = "document"