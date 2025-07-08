SHELL := /bin/bash
.DEFAULT_GOAL := help
help:
	@perl -nle'print $& if m{^[a-zA-Z_.-]+:.*?## .*$$}' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-25s\033[0m %s\n", $$1, $$2}'

update-components: ## Update components
	docker compose stop; \
	sudo rm -rf node_modules; \
	sudo rm -rf package-lock.json; \
	mkdir node_modules; \
	npm i; \
	docker compose up;

up: ## Start the development environment
	docker compose stop; \
	docker compose up;
