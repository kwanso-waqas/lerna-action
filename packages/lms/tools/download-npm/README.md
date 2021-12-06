# download-npm

## Installation
```
go install
```

## Usage

```bash
# downloads into ./tmp folder
npm-download --out ./tmp starboard-notebook@0.12.3 @illumidesk/starboard-nbgrader@0.3.0
```

And after that you can do
```bash
aws s3 sync ./tmp/ s3://mybucket/npm/
rm -rf ./tmp
```

