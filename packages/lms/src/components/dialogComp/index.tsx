import React, { FC } from 'react';
import DeleteDialog from './deleteDialog/index';
import EditOrDuplicateCourse from './editOrDuplicateCourse/index';

type DialogType =
  | 'deleteStudent'
  | 'deleteInstructor'
  | 'editCourse'
  | 'duplicateCourse'
  | 'deleteCourse'
  | 'deleteIntegration';

interface DialogComponentProps {
  primaryTitle: string;
  secondaryTitle?: string;
  description: string;
  buttonText: string;
  primaryBtnAction: () => void;
  secondaryBtnAction?: () => void;
  onClose: () => void;
  open: boolean;
  type: DialogType;
}

const DialogComponent: FC<DialogComponentProps> = ({
  primaryTitle,
  secondaryTitle,
  description,
  primaryBtnAction,
  secondaryBtnAction,
  onClose,
  open,
  buttonText,
  type,
}): JSX.Element => {
  switch (type) {
    case 'deleteIntegration':
    case 'deleteInstructor':
    case 'deleteStudent':
    case 'deleteCourse':
      return (
        <DeleteDialog
          primaryTitle={primaryTitle}
          description={description}
          buttonText={buttonText}
          primaryBtnAction={primaryBtnAction}
          open={open}
          secondaryBtnAction={secondaryBtnAction}
          secondaryTitle={secondaryTitle}
          onClose={onClose}
          type={type}
        />
      );
    case 'duplicateCourse':
    case 'editCourse':
      return (
        <EditOrDuplicateCourse
          title={primaryTitle}
          description={description}
          btnAction={primaryBtnAction}
          btnText={buttonText}
          onClose={onClose}
          open={open}
        />
      );
    default:
      return <> </>;
  }
};

export default DialogComponent;
