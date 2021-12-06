export function createNewNotebookContent(name: string) {
  return {
    cells: [
      {
        cell_type: 'markdown',
        id: '5fa0b358',
        metadata: {
          nbgrader: {
            grade: false,
            grade_id: '5fa0b358',
            locked: false,
            schema_version: 3,
            solution: false,
            task: false,
          },
        },
        source: [`# ${name}`],
      },
      {
        cell_type: 'code',
        execution_count: null,
        id: '31f1ba77',
        metadata: {
          nbgrader: {
            grade: false,
            grade_id: '31f1ba77',
            locked: true,
            points: 1,
            schema_version: 3,
            solution: false,
            task: true,
          },
        },
        outputs: [],
        source: ['print("Hello illumidesk!")\n', '# Print fizzbuzz below'],
      },
    ],
    metadata: {
      jupystar: {
        version: '0.2.1',
      },
      kernelspec: {
        display_name: 'Python 3 (ipykernel)',
        language: 'python',
        name: 'python3',
      },
      language_info: {
        codemirror_mode: {
          name: 'ipython',
          version: 3,
        },
        file_extension: '.py',
        mimetype: 'text/x-python',
        name: 'python',
        nbconvert_exporter: 'python',
        pygments_lexer: 'ipython3',
        version: '3.9.6',
      },
    },
    nbformat: 4,
    nbformat_minor: 5,
  };
}
