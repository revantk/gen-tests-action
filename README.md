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
    - name: Checkout
      uses: actions/checkout@v3
    - name: Checkout branch
      run: |
        if [ "${{ github.even_name }}" == "pull_request" ]; then
            PR_NUMBER="${{ github.event.number }}"
        else
            PR_NUMBER="${{ github.event.issue.number }}"
        fi
        echo $PR_NUMBER
        hub pr checkout $PR_NUMBER
      env:
        GITHUB_USER: ${{ github.repository_owner }}
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    - name: Unit Test Generator
      uses: revantk/gen-tests-action@main
      with:
        robustai-api-key: ${{ secrets.ROBUSTAI_API_KEY }}
        github-token: ${{ secrets.GITHUB_TOKEN }}
``` 
Add a Github Actions secret named `ROBUSTAI_API_KEY` to your repository settings with your API key. Note that `secrets.GITHUB_TOKEN` is automatically supplied by Github Actions and doesn't require manual setup.

- Make sure Github Actions has read and write permissions on your repository. This allows the action to add comments to pull requests and commit generated tests to your branch.
```
Settings -> Action -> General -> Workflow permissions > Read and Write permissions
```

- If you are using Docker compose as part of your CI/CD workflow, you can start any required services before the `Unit Test Generator` step like this:
```
jobs:
  gen-tests:
    steps:
      ...
    - name: Start services
      run: >
        docker-compose up -d myservice
    - name: Unit Test Generator
      ...
```

- If unit tests depend on services started in the command above, you can pass in the `--network` argument as part of the `docker-run-args` input to the action. These args will be passed into the `docker run` command when starting the container in which unit test generation + execution happens.
```
jobs:
  gen-tests:
    steps:
      ...
    - name: Unit Test Generator
      uses: revantk/gen-tests-action@main
      with:
        robustai-api-key: ${{ secrets.ROBUSTAI_API_KEY }}
        github-token: ${{ secrets.GITHUB_TOKEN }}
        docker-run-args: "--network container:myservice"
```


## Usage

On a pull request, make a comment with `/gen_tests` in the comment body. This will trigger a test generation action run. The action will look for functions that have changed between the PR branch and `main` and generate tests for those. Once tests are generated, the action will make a commit to your branch with the created / updated test files. The action will also add comments to the PR indicating the status of the run, as well as outputs from the test generation run.
