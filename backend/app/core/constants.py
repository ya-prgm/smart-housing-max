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
    HEATING_HOT_WATER = "heating_hot_water"
    COLD_WATER = "cold_water"
    ELECTRICITY = "electricity"
    TELECOM = "telecom"
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


class FileContext(str, enum.Enum):
    TICKET = "ticket"
    FEED = "feed"
    DOCUMENT = "document"