import { ReactElement, useCallback, useEffect, useState } from 'react';
import { css } from '@emotion/core';

import { UikitTheme } from '@icgc-argo/uikit/index';
import Button from '@icgc-argo/uikit/Button';
import FormControl from '@icgc-argo/uikit/form/FormControl';
import FormHelperText from '@icgc-argo/uikit/form/FormHelperText';
import Input from '@icgc-argo/uikit/form/Input';
import InputLabel from '@icgc-argo/uikit/form/InputLabel';
import Icon from '@icgc-argo/uikit/Icon';
import Link from '@icgc-argo/uikit/Link';
import Typography from '@icgc-argo/uikit/Typography';

import DoubleFieldRow from '../DoubleFieldRow';
import { FormFieldType } from '../types';
import { getMin, isRequired } from '../validations';

const ID = 'publicationURLs';

const PublicationURLs = ({
  error = [],
  value: fields,
  innerType,
  isSectionDisabled,
  validateFieldTouched,
  ...props
}: FormFieldType & Record<string, any>): ReactElement => {
  const minPublications = getMin(props) || 3;
  const [publicationsCount, setPublicationsCount] = useState<number>(minPublications);
  const [hasThreeValidURLs, setHasThreeValidURLs] = useState<boolean>(false);

  useEffect(() => {
    const newPublicationsCount = fields
      ? Object.values(fields).filter((item: any) => !item?.hidden).length
      : 0;
    setPublicationsCount(Math.max(newPublicationsCount, publicationsCount));
    setHasThreeValidURLs(newPublicationsCount >= minPublications && !error?.length);
  }, [error, fields]);

  const changePublicationsCount = (change: 'add' | 'remove', publicationField?: string) => () => {
    if (change === 'remove') {
      setPublicationsCount((prev) => prev - 1);
      validateFieldTouched({
        target: {
          id: publicationField,
          tagName: 'REMOVE',
          type: 'remove',
        },
        type: 'mousedown',
      });
    } else if (change === 'add') {
      setPublicationsCount((prev) => prev + 1);
    }
  };

  return (
    <section>
      <Typography bold component="h3" color="secondary">
        RELEVANT PUBLICATIONS
      </Typography>

      <Typography>
        <Typography as="span" bold>
          Please provide at least three links to relevant publications
        </Typography>
        , of which you, the applicant, were an author or a co-author. These should be links (URLs)
        to publication websites such as{' '}
        <Link href="https://pubmed.gov" rel="noopener noreferrer" target="_blank">
          pubmed.gov
        </Link>
        ,{' '}
        <Link href="https://biorxiv.org" rel="noopener noreferrer" target="_blank">
          biorxiv.org
        </Link>
        , or{' '}
        <Link href="https://medrxiv.org" rel="noopener noreferrer" target="_blank">
          medrxiv.org
        </Link>
        .
      </Typography>

      {Object.values<FormFieldType>(
        Object.entries(fields || {}).reduce(
          (urlsAcc, [index, item]) => ({
            ...urlsAcc,
            [index]: item,
          }),
          // this pads the publicationURLs array to have at least `minPublications`-many items
          Array.from(
            {
              length: Math.max(minPublications, publicationsCount),
            },
            () => ({ value: '' }),
          ),
        ),
      ).map(
        (item, index) =>
          !item.hidden && (
            <DoubleFieldRow
              actions={
                index >= minPublications ? (
                  <Button
                    css={css`
                      label: action_remove;
                      margin: 7px -5px 0 5px;
                      width: 30px;
                    `}
                    disabled={isSectionDisabled}
                    onClick={changePublicationsCount('remove', `publicationURLs--${index}--remove`)}
                    size="sm"
                    variant="text"
                  >
                    <Icon fill={isSectionDisabled ? 'grey_1' : 'accent2'} name="trash" />
                  </Button>
                ) : (
                  <div
                    css={css`
                      width: 30px;
                    `}
                  />
                )
              }
              css={(theme: UikitTheme) => css`
                border: 1px solid ${theme.colors.grey_2};
                label: DoubleFieldRow;
                margin: 10px 0;
                padding: 10px;
              `}
              key={`publicationURLs--${index}`}
            >
              <FormControl error={!!item.error} required={isRequired(innerType)}>
                <InputLabel htmlFor="title">Publication URL</InputLabel>

                <Input
                  aria-label="Project Title"
                  disabled={isSectionDisabled}
                  id={`publicationURLs--${index}`}
                  onBlur={validateFieldTouched}
                  onChange={validateFieldTouched}
                  value={item.value}
                />

                <FormHelperText onErrorOnly>
                  {item.error?.[0] !== 'this field must have at least 3 items' && item.error?.[0]}
                </FormHelperText>
              </FormControl>
            </DoubleFieldRow>
          ),
      )}

      <Button
        onClick={changePublicationsCount('add')}
        size="sm"
        variant="text"
        disabled={isSectionDisabled || !hasThreeValidURLs}
      >
        <Icon
          fill={isSectionDisabled || !hasThreeValidURLs ? 'grey_1' : 'accent2'}
          css={css`
            margin-right: 5px;
          `}
          name="plus_circle"
        />
        ADD ANOTHER
      </Button>
    </section>
  );
};

export default PublicationURLs;
