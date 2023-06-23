# gen-tests-action

Github action for generating unit tests automatically. Currently works only for Python codebases.

## Setup

- Create a new Github actions workflow file
```
mkdir -p .github/workflows/ && touch .github/workflows/gen_tests.yml
``` 

- Add a workflow name to `gen_tests.yml`
```
name: Gen Tests
```

- Add pull request and comment triggers to the workflow. This allows us to trigger the workflow by commenting on pull requests.
```
on:
  pull_request:
    types: [opened]
  issue_comment:
    types: [created]
```

- Add a job to the workflow that references this extension

```
jobs:
  gen-tests:
    name: Generate Unit Tests
    runs-on: ubuntu-latest
    steps:
      - name: Unit Test Generator
        uses: revantk/gen-tests-action@0.1
        with:
          robustai-api-key: ${{ secrets.ROBUSTAI_API_KEY }}
```
- Add a Github Actions secret named `ROBUSTAI_API_KEY` to your repository settings with your API key

- If you are using Docker images as part of your CI/CD workflow, you can run test generation in a Docker image with the requisite dependencies for your project. Add a `container` section under the job in your worflow YAML file.
```
jobs:
  gen-tests:
    ...
    container:
      image: <docker-image>
      options: --user root  # workaround for Github actions Node.js installation
      credentials:
        username: ${{ secrets.DOCKER_REGISTRY_USERNAME }}
        password: ${{ secrets.DOCKER_REGISTRY_TOKEN }}
    steps:
      ...
```
Replace `<docker-image>` with the URL for your docker image.
Also ensure that the `DOCKER_REGISTRY_USERNAME` and `DOCKER_REGISTRY_TOKEN` secrets are set in your repository settings. These can be credentials for Dockerhub, AWS Elastic Container Registry, Github container registry etc.
If you are a using a public image, you can omit the credentials section.


## Usage

On a pull request, make a comment with `/gen_tests` in the comment body. This will trigger a test generation action run. The action will look for functions that have changed between the PR branch and `main` and generate tests for those. Once tests are generated, the action will make a commit to your branch with the created / updated test files.
