#!/bin/bash
set -e

tag=ngekaworu/flashcard-umi

docker build --file ./Dockerfile --tag ${tag} ..;
docker push ${tag};
