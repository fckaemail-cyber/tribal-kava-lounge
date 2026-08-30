FROM python:3.12-slim-bookworm

RUN apt-get update \
    && apt-get install --yes --no-install-recommends ca-certificates git openssh-client \
    && rm -rf /var/lib/apt/lists/*

COPY github_known_hosts /etc/ssh/ssh_known_hosts
COPY daily-job-entrypoint.sh /usr/local/bin/daily-kava-job

RUN chmod 0644 /etc/ssh/ssh_known_hosts \
    && chmod 0755 /usr/local/bin/daily-kava-job \
    && useradd --create-home --uid 10001 runner

USER runner
WORKDIR /home/runner

ENTRYPOINT ["/usr/local/bin/daily-kava-job"]
