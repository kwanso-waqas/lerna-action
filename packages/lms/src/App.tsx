import { ThemeProvider } from '@material-ui/core/styles';
import { CustomTheme } from '@illumidesk/common-ui';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import { CourseProvider } from './context/courses';

import Router from './routes';

function App(): JSX.Element {
  return (
    <ThemeProvider theme={CustomTheme}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <CourseProvider>
          <Router />
        </CourseProvider>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
}

export default App;
