import uvicorn
import logging
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
import kociemba

from models import CubeAnalysisRequest, SolvedResponsePayload

# Logging telemetry setup core
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s]: %(message)s")
logger = logging.getLogger("APIProductionEngine")

app = FastAPI(
    title="Rubik Cube Compiler Pipeline Node Engine System",
    description="Microservice exposing optimal Kociemba algorithms via strict production schema patterns.",
    version="1.0.0"
)

# CORS Policy parameters routing infrastructure setup allowing index.html safe calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post(
    "/api/v1/solve", 
    response_model=SolvedResponsePayload, 
    status_code=status.HTTP_200_OK,
    summary="Resolves targeted cube string payloads using Two-Phase evaluations."
)
async def endpoint_solve_cube(payload: CubeAnalysisRequest) -> SolvedResponsePayload:
    logger.info("Intercepted runtime operational call pipeline calculation query request.")
    try:
        raw_stream = payload.definition_string
        
        # Validating specific configuration matrices values constraints boundaries
        valid_charset = {'U', 'R', 'F', 'D', 'L', 'B'}
        if set(raw_stream) - valid_charset:
            return SolvedResponsePayload(
                is_success=False, 
                raw_sequence="", 
                moves=[], 
                error_message="Illegal character arrays detected inside data parameters definitions payload."
            )
            
        logger.info("Executing Herbert Kociemba mathematical processing engine algorithms loops...")
        computed_string_route = kociemba.solve(raw_stream)
        steps_list = computed_string_route.split()
        
        logger.info("Calculations completed. Dispatched optimization payload array records back safely.")
        return SolvedResponsePayload(
            is_success=True,
            raw_sequence=computed_string_route,
            moves=steps_list
        )
        
    except Exception as runtime_fault:
        logger.error(f"Internal computation fault exception hit inside core loop thread: {runtime_fault}")
        return SolvedResponsePayload(
            is_success=False,
            raw_sequence="",
            moves=[],
            error_message=f"Algorithmic computational verification failed processing array structural states layout: {str(runtime_fault)}"
        )

if __name__ == "__main__":
    # Booting production deployment wrapper locally mapping port :8000 channels execution hooks
    uvicorn.run("solver_api.py:app", host="127.0.0.1", port=8000, reload=True)
