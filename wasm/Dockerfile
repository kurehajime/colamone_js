FROM rust:slim-bookworm
WORKDIR /usr/src/myapp
RUN apt update && apt install -y build-essential
RUN cargo install wasm-pack