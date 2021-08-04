import Notification from '@icgc-argo/uikit/notifications/Notification';

const TITLE_COLLABORATOR_NOT_ADDED = 'Collaborator could not be added';
const TITLE_GENERIC_ERROR = 'Something went wrong';

export enum AddCollaboratorError {
  CollaboratorExists = 'CollaboratorExists',
  CollaboratorIsApplicant = 'CollaboratorIsApplicant',
  GenericError = 'GenericError',
}

export enum CollaboratorErrorCodes {
  COLLABORATOR_EXISTS = 'COLLABORATOR_EXISTS',
}

const getErrorContent = (error: keyof typeof AddCollaboratorError) => {
  switch (error) {
    case AddCollaboratorError.CollaboratorExists:
      return {
        title: TITLE_COLLABORATOR_NOT_ADDED,
        content: 'The collaborator has already been added to your application.',
      };
    case AddCollaboratorError.CollaboratorIsApplicant:
      return {
        title: TITLE_COLLABORATOR_NOT_ADDED,
        content: 'The applicant does not need to be added as a collaborator.',
      };
    case AddCollaboratorError.GenericError:
      return {
        title: TITLE_GENERIC_ERROR,
        content: 'Your action could not be completed please try again.',
      };
  }
};

const ErrorBanner = ({ error }: { error: keyof typeof AddCollaboratorError }) => (
  <Notification variant="ERROR" {...getErrorContent(error)} />
);

export default ErrorBanner;
