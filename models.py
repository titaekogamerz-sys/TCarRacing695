from pydantic import BaseModel, Field

class CubeAnalysisRequest(BaseModel):
    """Client backend contract validator scheme abstraction tracking 54 string lengths."""
    definition_string: str = Field(
        ..., 
        min_length=54, 
        max_length=54, 
        description="Singmaster notation compliant configuration array state mapping vector."
    )

class SolvedResponsePayload(BaseModel):
    """Response interface model contract wrapping computed route output values."""
    is_success: bool
    raw_sequence: str
    moves: list[str]
    error_message: str | None = None
