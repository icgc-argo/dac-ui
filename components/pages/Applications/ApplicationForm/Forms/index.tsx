import { ReactElement } from 'react';
import { css } from '@icgc-argo/uikit';
import Button from '@icgc-argo/uikit/Button';
import Icon from '@icgc-argo/uikit/Icon';
import { UikitTheme } from '@icgc-argo/uikit/index';
import { ContentBody, ContentBox } from '@icgc-argo/uikit/PageLayout';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import Typography from '@icgc-argo/uikit/Typography';
import VerticalTabs from '@icgc-argo/uikit/VerticalTabs';

const ApplicationFormsBase = (): ReactElement => {
  const theme: UikitTheme = useTheme();

  return (
    <ContentBody>
      <ContentBox 
        css={css`
          box-sizing: border-box;
          display: flex;
          margin: 10px auto 0;
          max-width: 1200px;
          min-width: 665px;
          width: 100%;
        `}
      >
        <VerticalTabs
          css={css`
            background: ${theme.colors.grey_4};
            border-radius: 8px 0 0 8px;
            margin: -8px 0;
            margin-left: -8px;
            min-width: 205px;
            max-width: 280px;
          `}
        >
          <VerticalTabs.Item>
            Table of Contents
          </VerticalTabs.Item>
          
          <VerticalTabs.Item
            active
            onClick={function noRefCheck(){}}
          >
            Introduction
            {/* <VerticalTabs.Tag variant="UPDATE">
              12
            </VerticalTabs.Tag> */}
          </VerticalTabs.Item>
          
          <VerticalTabs.Item
            onClick={function noRefCheck(){}}
          >
            A. Application Information
            {/* <VerticalTabs.Tag variant="WARNING">
              23
            </VerticalTabs.Tag> */}
          </VerticalTabs.Item>
          
          <VerticalTabs.Item
            onClick={function noRefCheck(){}}
          >
            B. Institutional Representative
            {/* <VerticalTabs.Tag variant="ERROR">
              !
            </VerticalTabs.Tag> */}
          </VerticalTabs.Item>
          
          <VerticalTabs.Item
            onClick={function noRefCheck(){}}
          >
            C. Collaborators
            {/* <VerticalTabs.Tag variant="SUCCESS">
              45
            </VerticalTabs.Tag> */}
          </VerticalTabs.Item>
          
          <VerticalTabs.Item
            onClick={function noRefCheck(){}}
          >
            D. Project Information
            {/* <VerticalTabs.Tag variant="SUCCESS">
              45
            </VerticalTabs.Tag> */}
          </VerticalTabs.Item>

          <VerticalTabs.Item
            onClick={function noRefCheck(){}}
          >
            E. Ethics
            {/* <VerticalTabs.Tag variant="SUCCESS">
              45
            </VerticalTabs.Tag> */}
          </VerticalTabs.Item>

          <VerticalTabs.Item
            onClick={function noRefCheck(){}}
          >
            F. IT Agreements
            {/* <VerticalTabs.Tag variant="SUCCESS">
              45
            </VerticalTabs.Tag> */}
          </VerticalTabs.Item>

          <VerticalTabs.Item
            onClick={function noRefCheck(){}}
          >
            G. Data Access Agreement
            {/* <VerticalTabs.Tag variant="SUCCESS">
              45
            </VerticalTabs.Tag> */}
          </VerticalTabs.Item>

          <VerticalTabs.Item
            onClick={function noRefCheck(){}}
          >
            H. Appendices
            {/* <VerticalTabs.Tag variant="SUCCESS">
              45
            </VerticalTabs.Tag> */}
          </VerticalTabs.Item>

          <VerticalTabs.Item
            onClick={function noRefCheck(){}}
          >
            Sign &amp; Submit
            {/* <VerticalTabs.Tag variant="SUCCESS">
              45
            </VerticalTabs.Tag> */}
          </VerticalTabs.Item>
        </VerticalTabs>

        <div
          css={css`
            border-radius: 0 8px 8px 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin: -8px 0;
            margin-right: -8px;
            min-width: 460px;
            width: 100%;
          `}
        >
          <header
            css={css`
              align-items: center;
              border-bottom: 1px solid ${theme.colors.grey_2};
              height: 40px;
              display: flex;
              padding: 0 40px;
            `}
          >
            <Typography
              component="h1"
              css={css`
                margin: 0;
              `}
              variant="subtitle"
            >
              <Icon
                css={css`
                  margin-bottom: -5px;
                  margin-right: 8px;
                `}
                fill={theme.colors.secondary}
                name="form"
              />
              Application for Controlled Data Access
            </Typography>
          </header>

          <footer
            css={css`
              align-items: center;
              border-top: 1px solid ${theme.colors.grey_2};
              display: flex;
              height: 40px;
              justify-content: space-between;
              padding: 0 40px;
            `}
          >
            <Button
              onClick={function noRefCheck(){}}
              size="sm"
            >
              <Icon
                fill={theme.colors.white}
                height="9px"
                name="chevron_left"
              />{' '}

              Previous Section
            </Button>

            <Button
              onClick={function noRefCheck(){}}
              size="sm"
            >
              Next Section{' '}

              <Icon
                fill={theme.colors.white}
                height="9px"
                name="chevron_right"
              />
            </Button>
          </footer>
        </div>
      </ContentBox>
    </ContentBody>
  );
};

export default ApplicationFormsBase;
