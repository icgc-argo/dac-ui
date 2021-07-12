import { css } from '@emotion/core';
import Button from '@icgc-argo/uikit/Button';
import Control from '@icgc-argo/uikit/form/FormControl';
import FormHelperText from '@icgc-argo/uikit/form/FormHelperText';
import Input from '@icgc-argo/uikit/form/Input';
import InputLabel from '@icgc-argo/uikit/form/InputLabel';
import Icon from '@icgc-argo/uikit/Icon';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import Typography from '@icgc-argo/uikit/Typography';
import React, { ReactElement } from 'react';
import DoubleFieldRow from './DoubleFieldRow';
import FormFieldHelpBubble from './FormFieldHelpBubble';
import { RequiredStar } from './RequiredFieldsMessage';
import FileSelectButton from '@icgc-argo/uikit/FileSelectButton';
import { styled } from '@icgc-argo/uikit';

const FormControl = styled(Control)`
  display: flex;
  flex-wrap: nowrap !important;
  figure {
    margin: 0;
  }
`;

const Signature = (): ReactElement => {
  const theme = useTheme();
  return (
    <article>
      <Typography bold component="h2">
        Sign & Submit
      </Typography>
      <section
        css={css`
          ol {
            margin: 0;
            padding: 8px 0 40px 17px;
          }

          li {
            line-height: 24px;
            margin: 25px 0;
          }
        `}
      >
        <Typography>
          <p css={css``}>
            The final step involves adding the proper signatures to authorize this application.
            Please do the following:{' '}
          </p>
          <ol>
            <li>
              <div
                css={css`
                  display: flex;
                  align-items: center;
                `}
              >
                {' '}
                Download the finalized application:{' '}
                <Button
                  size="sm"
                  css={css`
                    display: inline-block;
                    line-height: 12px;
                    margin-left: 6px;
                  `}
                >
                  <span
                    css={css`
                      display: flex;
                      flex-direction: row;
                      align-items: center;
                    `}
                  >
                    <Icon
                      css={css`
                        margin-bottom: -2px;
                        margin-right: 4px;
                      `}
                      fill={theme.colors.white}
                      height="12px"
                      name="download"
                    />
                    Finalized pdf
                  </span>
                </Button>
              </div>
            </li>
            <li>
              {' '}
              On the last page of the application pdf you will find a signatures page.{' '}
              <b>
                You must include BOTH the Principal Investigator and the Institutional
                Representative signatures or your application will be declined.
              </b>
              <br />
              <div
                css={css`
                  margin-left: 10px;
                `}
              >
                a) You can print this page, collect the written signatures, scan the signed page and
                add it back to the finalized application pdf. <br />
                b) Or you can add the proper signatures using electronic methods, such as{' '}
                <a href="https://www.docusign.ca/">DocuSign</a> or{' '}
                <a href="https://acrobat.adobe.com/us/en/sign.html">AdobeSign.</a>
              </div>
            </li>
            <li>Upload the signed application below.</li>
          </ol>
          <div
            css={css`
              display: flex;
              justify-content: flex-end;
            `}
          >
            <Typography
              bold
              variant="label"
              css={css`
                margin: 8px 0;
              `}
            >
              <RequiredStar /> Indicates required fields
            </Typography>
          </div>
        </Typography>
      </section>

      <section>
        <Typography
          bold
          component="h3"
          css={css`
            color: #0774d3;
          `}
        >
          UPLOAD SIGNED APPLICATION
        </Typography>
        <FormControl required>
          <InputLabel
            htmlFor="signedApplication"
            css={css`
              width: 144px !important;
            `}
          >
            Signed Application:
          </InputLabel>

          <FileSelectButton
            size="sm"
            onFilesSelect={(e) => console.log('file selected', e)}
            aria-label="Signed Application"
            css={css`
              width: 220px;
              margin-right: 70px;
              margin-left: 20px;
            `}
          >
            <Icon
              name="upload"
              height="12px"
              width="12px"
              fill="white"
              css={css`
                margin-right: 3px;

                margin-bottom: -2px;
                margin-right: 4px;
              `}
            />
            Upload a file
          </FileSelectButton>
          <FormFieldHelpBubble text="Allowed file types: pdf. | Max file size: 200MB" />
        </FormControl>

        <Button
          css={css`
            margin-top: 40px;
          `}
        >
          Submit Application
        </Button>
      </section>
    </article>
  );
};

export default Signature;
