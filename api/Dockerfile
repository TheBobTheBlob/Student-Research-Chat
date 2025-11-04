FROM python:3.13
WORKDIR ./app
COPY . .
ENV JWT_SECRET_KEY="81ecd823031fbe6ca059a418e4d7cf52"
ENV JWT_ALGORITHM="HS256"
RUN pip install --no-cache-dir -r requirements.txt
