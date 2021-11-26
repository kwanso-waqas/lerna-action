# Frontend React Application for nbgrader

IllumiDesk's React Application that replaces [nbgrader](https://github.com/jupyter/nbgrader)'s standard frontend. It _should_ work as a drop in replacement for the nbgrader UI by integrating nbgrader's standard RESTful API.

The [aync-nbgrader](https://github.com/jupyter/async-nbgrader) package mentioned below is to grade assignments with async jobs instead of the standard synchronous-based jobs provided by nbgrader.

**NOTE**: As a convinience the [formgradernext](https://github.com/illumidesk/formgradernext) package serves the `lms` UI from a CDN. The installation instructions below are primarily for local testing or if you serve the bundle from another location.

## Backend Setup (nbgrader RESTful API)

### Requirements

- [Python 3.8+](https://realpython.com/installing-python/)
- (Recommended) [Virtualenv](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/#installing-virtualenv) 

### Setup

1. Create and activate your virtual environment:

```bash
virtualenv -p python3 venv
source venv/bin/activate
```

1. Install the latest release of `async_nbgrader`:

```bash
pip install git+ssh://git@github.com/IllumiDesk/async-nbgrader.git
```

1. Enable `async_nbgrader` client and server extensions:

```bash
jupyter nbextension enable --sys-prefix async_nbgrader/common
jupyter serverextension enable --sys-prefix nbgrader.server_extensions.formgrader
jupyter serverextension enable --sys-prefix --py async_nbgrader
```

1. Run the Jupyter Notebook:

```bash
jupyter notebook \
  --NotebookApp.allow_origin="http://localhost:3000" \
  --NotebookApp.disable_check_xsrf=True \
  --NotebookApp.token=<my-secure-token>
```

1. Then you can use the standard RESTful API to reference specific assignments:
 
```
http://localhost:3000/assignment/some-id
```
