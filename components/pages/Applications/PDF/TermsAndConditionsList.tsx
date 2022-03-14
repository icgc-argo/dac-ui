/*
 * Copyright (c) 2022 The Ontario Institute for Cancer Research. All rights reserved
 *
 * This program and the accompanying materials are made available under the terms of
 * the GNU Affero General Public License v3.0. You should have received a copy of the
 * GNU Affero General Public License along with this program.
 *  If not, see <http://www.gnu.org/licenses/>.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import { getConfig } from 'global/config';
import { DATA_BREACH_POLICY_PAGE, PUBLICATION_POLICY_PAGE } from 'global/constants';
import { ForwardRefExoticComponent } from 'react';

const { NEXT_PUBLIC_DACO_EMAIL_ADDRESS } = getConfig();

const termsAndConditionsList = (
  ListComponent: (props: any) => JSX.Element,
  LinkComponent: ForwardRefExoticComponent<any> | ((props: any) => JSX.Element),
  TextComponent: ((props: any) => JSX.Element) | React.ComponentType<any>,
) => [
  ({ count }: { count: number }) => (
    <ListComponent count={count}>
      The User and the User Institution(s) agree to use the ICGC Controlled Data in compliance with
      all ICGC Goals, Structures, Policies and Guidelines including section E. Ethics and Appendix I
      of this application.
    </ListComponent>
  ),
  ({ count }: { count: number }) => (
    <ListComponent count={count}>
      The Data Access Period of two (2) years is the maximum approval time for any application. The
      term of this Agreement may be extended by the mutual written agreement of both Parties signed
      by their authorized signatories.
    </ListComponent>
  ),
  ({ count }: { count: number }) => (
    <ListComponent count={count}>
      The User and the User Institution(s) agree to only use the ICGC Controlled Data for the
      objectives and analyses outlined in section D. Project Information.
    </ListComponent>
  ),
  ({ count }: { count: number }) => (
    <ListComponent count={count}>
      The User and the User Institution(s) assumes responsibility for maintaining appropriate
      Ethical approval (if so required). Ethical approval must be current for the duration of the
      approved Data Access Period.
    </ListComponent>
  ),
  ({ count }: { count: number }) => (
    <ListComponent count={count}>
      The User and the User Institution(s) agree to preserve, at all times, the confidentiality of
      the information and ICGC Controlled Data. In particular, they undertake not to use, or attempt
      to use the ICGC Controlled Data to compromise or otherwise infringe the confidentiality of
      information on Research Participants.
    </ListComponent>
  ),
  ({ count }: { count: number }) => (
    <ListComponent count={count}>
      The User and the User Institution(s) agree to protect the confidentiality of Research
      Participants in any research papers or publications that they prepare by taking all reasonable
      care to limit the possibility of identification.
    </ListComponent>
  ),
  ({ count }: { count: number }) => (
    <ListComponent count={count}>
      The User and the User Institution(s) agree not to link or combine the ICGC Controlled Data
      provided under this agreement to other information or archived data available in a way that
      could re-identify the Research Participants, even if access to that data has been formally
      granted to the User and the User Institution(s), or is freely available without restriction.
    </ListComponent>
  ),
  ({ count }: { count: number }) => (
    <ListComponent count={count}>
      The User and the User Institution(s) agree not to transfer or disclose the ICGC Controlled
      Data, in whole or part, or any material derived from the ICGC Controlled Data, to anyone not
      listed in section C. Collaborators of this application, except where prior written permission
      for such transfer or disclosure has been agreed to by the University. Should the User or the
      User Institution(s) wish to share the ICGC Controlled Data with an External Collaborator, the
      External Collaborator must complete a separate application for Access to the ICGC Controlled
      Data.
    </ListComponent>
  ),
  ({ count }: { count: number }) => (
    <ListComponent count={count}>
      The User and the User Institution(s) accept that the Consortium, the member institutions
      including producers, depositors or copyright holders, or the funders of the ICGC Controlled
      Data or any part of the ICGC Controlled Data supplied bear no responsibility for the further
      analysis or interpretation of these ICGC Controlled Data, over and above that published by the
      Consortium.
    </ListComponent>
  ),
  ({ count }: { count: number }) => (
    <ListComponent count={count}>
      The User and the User Institution(s) agree to follow the Fort Lauderdale Guidelines, the
      Toronto Statement, as well as the GA4GH Framework for Responsible Sharing of Genomic and
      Health-Related Data included as linked Appendix II of this application. This includes but is
      not limited to recognizing the contribution of the Consortium including an acknowledgement in
      all reports or publications resulting from the User and the User Institutions use of the ICGC
      Controlled Data.
    </ListComponent>
  ),
  ({ count }: { count: number }) => (
    <ListComponent count={count}>
      The User agrees to confirm as requested submit ongoing compliance with this agreement and its
      conditions each year on the anniversary of the approval date.
    </ListComponent>
  ),
  ({ count }: { count: number }) => (
    <ListComponent count={count}>
      The User agrees to submit a final report at the completion of the Data Access Period, or if a
      study is closed, upon request by the DACO Officer.
    </ListComponent>
  ),
  ({ count }: { count: number }) => (
    <ListComponent count={count}>
      The User and the User Institution(s) agree to follow the{' '}
      <LinkComponent target="_blank" href={PUBLICATION_POLICY_PAGE}>
        Consortium Publication Policy
      </LinkComponent>
      .
    </ListComponent>
  ),
  ({ count }: { count: number }) => (
    <ListComponent count={count}>
      The User and the User Institution(s) agree to destroy, remove or revoke access to any
      controlled data where they have been notified that consent has been withdrawn.
    </ListComponent>
  ),
  ({ count }: { count: number }) => (
    <ListComponent count={count}>
      The User and the User Institution(s) agree not to make intellectual property claims on the
      ICGC Controlled Data (including somatic mutations) and not to use intellectual property
      protection in ways that would prevent or block access to, or use of, any element of the ICGC
      Controlled Data, or conclusion drawn directly from the ICGC Controlled Data.
    </ListComponent>
  ),
  ({ count }: { count: number }) => (
    <ListComponent count={count}>
      The User and the User Institution(s) can elect to perform further research that would add
      intellectual and resource capital to the ICGC Controlled Data and decide to obtain
      intellectual property rights on these downstream discoveries. In this case, the User and the
      User Institution(s) agree to implement licensing policies that will not obstruct further
      research and to follow the U.S. National Institutes of Health's, Best Practices for the
      Licensing of Genomic Inventions or a similar national guideline that is in conformity with the
      OECD, Guidelines for the Licensing of the Genetic Inventions. These two policies (NIH and
      OECD) are included as part of the linked Appendix III of this application.
    </ListComponent>
  ),
  ({ count }: { count: number }) => (
    <ListComponent count={count}>
      The User and the User Institution (s) shall implement and maintain, at its cost and expense,
      appropriate technical and organisational measures in relation to the processing of ICGC
      Controlled Data and Personal Information. The User will ensure that the security it implements
      in respect of Personal Information processed by it is appropriate to the risks that are
      presented by the processing, in particular from accidental or unlawful destruction, loss,
      alteration, unauthorised disclosure of, or access to Personal Information transmitted, stored
      or otherwise processed.
    </ListComponent>
  ),
  ({ count }: { count: number }) => (
    <ListComponent count={count}>
      The User and the User Institution(s) agree to destroy/discard any ICGC Controlled Data held,
      once it is no longer used for the project described in this application unless obligated to
      retain the ICGC Controlled Data for archival purposes in conformity with national audits or
      legal requirements.
    </ListComponent>
  ),
  ({ count }: { count: number }) => (
    <ListComponent count={count}>
      The User and the User Institution(s) will update the Section C. Collaborators to reflect any
      changes or departures in researchers, collaborators and personnel within 30 days of the
      changes made.
    </ListComponent>
  ),
  ({ count }: { count: number }) => (
    <ListComponent count={count}>
      The User and the User Institution(s) must notify the DACO prior to any significant changes to
      the Research Project's protocol of the User. This update can be sent by email to this address:{' '}
      <LinkComponent showHref={false} href={`mailto:${NEXT_PUBLIC_DACO_EMAIL_ADDRESS}`}>
        {NEXT_PUBLIC_DACO_EMAIL_ADDRESS}
      </LinkComponent>
      .
    </ListComponent>
  ),
  ({ count }: { count: number }) => (
    <ListComponent count={count}>
      The User and the User Institution(s) will notify the DACO (
      <LinkComponent showHref={false} href={`mailto:${NEXT_PUBLIC_DACO_EMAIL_ADDRESS}`}>
        {NEXT_PUBLIC_DACO_EMAIL_ADDRESS}
      </LinkComponent>
      ) as soon as they become aware of a breach of the terms or conditions of this agreement. All
      security incidents are to be reported without delay as outlined in the{' '}
      <LinkComponent target="_blank" href={DATA_BREACH_POLICY_PAGE}>
        Data Breach Policy
      </LinkComponent>
      .
    </ListComponent>
  ),
  ({ count }: { count: number }) => (
    <ListComponent count={count}>
      The User and the User Institution(s) accept that this agreement may terminate upon any breach
      of this agreement from the User, the User Institution(s) or any authorized personnel mentioned
      in section C. Collaborators of this application. In this case, The User and the User
      Institution(s) will be required to destroy/discard any ICGC Controlled Data held, including
      copies and backup copies. This clause does not prevent the User and the User Institution(s)
      from retaining the ICGC Controlled Data for archival purposes in conformity with national
      audits or legal requirements.
    </ListComponent>
  ),
  ({ count }: { count: number }) => (
    <ListComponent count={count}>
      The User and the User Institution(s) accept that it may be necessary for the Consortium or its
      appointed agent to alter the terms of this agreement from time to time. In this event, the
      Consortium or its appointed agent will contact the User and the User Institution(s) to inform
      them of any changes. The revised terms shall be binding upon the User and the User
      Institution(s) upon notification to the User or the User Institution(s) or the continued use
      of the ICGC Controlled Data by the User or the User Institution(s) after any such revision.
    </ListComponent>
  ),
  ({ count }: { count: number }) => (
    <ListComponent count={count}>
      The User and the User Institution(s) agree to distribute a copy of this agreement and explain
      its content to any person mentioned in section C. Collaborators.
    </ListComponent>
  ),
  ({ count }: { count: number }) => (
    <ListComponent count={count}>
      The University as Data Controller (Regulation (EU) 2016/679 (General Data Protection
      Regulation) governs ICGC operations and management, including the DACO and Data Coordination
      Centre and associated Regional Data Processing Centres.
    </ListComponent>
  ),
  ({ count }: { count: number }) => (
    <ListComponent count={count}>
      The Information you provide includes personal data. The Parties acknowledge that the legal
      basis for the processing of such personal information shall be Article 6(1)(e) of the GDPR
      (performance of a task in the public interest) and, to the extent that the Information
      includes any of the special categories of personal information [data] under Article 9 of the
      GDPR, the legal basis for the processing of such information shall be Article 9(2)(j) of the
      GDPR (processing in the public interest, scientific or historical research purposes or
      statistical purposes). This information is kept for a period of 10 years in line with the
      purposes of data processing. If you require more information or access to the information held
      about you please contact{' '}
      <LinkComponent showHref={false} href={`mailto:${NEXT_PUBLIC_DACO_EMAIL_ADDRESS}`}>
        {NEXT_PUBLIC_DACO_EMAIL_ADDRESS}
      </LinkComponent>
      .
    </ListComponent>
  ),
  ({ count }: { count: number }) => (
    <ListComponent count={count}>
      <TextComponent>DISCLAIMER</TextComponent>
      <TextComponent as="span">
        {' '}
        THE ICGC, THROUGH UNIVERSITY AND THE DACO, PROVIDE THE ICGC CONTROLLED DATA AND ACCESS
        THERETO ON AN "AS IS" "WHERE IS" BASIS. THE UNIVERSITY MAKES NO REPRESENTATIONS OR
        WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY OR OTHERWISE AS TO THE ACCURACY,
        COMPLETENESS OR AVAILABILITY OF THE ICGC CONTROLLED DATA OR OF THE ICGC CONTROLLED DATA'S
        MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE, OR THAT THE USE OF THE ICGC CONTROLLED
        DATA WILL NOT INFRINGE ANY PATENT, COPYRIGHT, OR TRADEMARK, OR OTHER RIGHTS OR ANY OTHER
        EXPRESS OR IMPLIED WARRANTIES. UNIVERSITY DOES NOT WARRANT THAT THE ICGC CONTROLLED DATA
        WILL MEET YOUR REQUIREMENTS OR EXPECTATIONS. YOUR USE OF THE ICGC CONTROLLED DATA IS AT YOUR
        OWN RISK.
      </TextComponent>
    </ListComponent>
  ),
  ({ count }: { count: number }) => (
    <ListComponent count={count}>
      <TextComponent>LIMITATIONS OF LIABILITY</TextComponent>
      <TextComponent as="span">
        UNIVERSITY WILL NOT BE LIABLE TO YOU FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, PUNITIVE
        OR EXEMPLARY DAMAGES (INCLUDING DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, OR DATA), EVEN
        IF A PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. FURTHER, UNIVERSITY WILL NOT
        BE RESPONSIBLE FOR ANY COMPENSATION, REIMBURSEMENT, OR DAMAGES ARISING IN CONNECTION WITH:
        YOUR INABILITY TO ACCESS OR USE ICGC CONTROLLED DATA, INCLUDING AS A RESULT OF ANY (A)
        TERMINATION OR SUSPENSION OF YOUR USE OF OR ACCESS TO THE ICGC CONTROLLED DATA, (B)
        DISCONTINUATION OF AVAILABILITY OF ANY OR ALL OF THE ICGC CONTROLLED DATA, OR, (C) ANY UNAN-
        TICIPATED OR UNSCHEDULED DOWNTIME OF ALL OR A PORTION OF THE ICGC CONTROLLED DATA FOR ANY
        REASON. IN NO EVENT SHALL THE UNIVERSITY'S LIABILITY UNDER THIS AGREEMENT EXCEED AMOUNTS
        PAID UNDER THE AGREEMENT BY YOU TO THE UNIVERSITY.
      </TextComponent>
    </ListComponent>
  ),
  ({ count }: { count: number }) => (
    <ListComponent count={count}>
      <TextComponent>INDEMNIFICATION</TextComponent>
      <TextComponent as="span">
        YOU WILL DEFEND, INDEMNIFY, AND HOLD HARMLESS THE UNIVERSITY, ITS MEMBERS, OFFICERS,
        EMPLOYEES, CONTRACTORS, SUBCONTRACTORS, STUDENTS AND AGENTS (INCLUDING THE DACO) FROM AND
        AGAINST ANY CLAIMS, DAMAGES, LOSSES, LIABILITIES, COSTS, AND EXPENSES (INCLUDING LEGAL FEES)
        ARISING OUT OF OR RELATING TO ANY THIRD PARTY CIVIL OR ADMINISTRATIVE ACTIONS, PROCEEDINGS
        OR CLAIM CONCERNING: (A) YOUR USE OF THE ICGC CONTROLLED DATA (INCLUDING ANY ACTIVITIES OF
        YOUR STUDENTS AND STAFF); (B) BREACH OF THIS AGREEMENT OR VIOLATION OF APPLICABLE LAW BY YOU
        OR YOUR STUDENTS AND STAFF; OR (C) THE ALLEGED INFRINGEMENT OF ANY COPYRIGHT, PATENT,
        TRADEMARK, TRADE SECRET OR OTHER INTELLECTUAL PROPERTY OR PROPRIETARY RIGHT ARISING OUT OF
        YOUR USE OF THE ICGC CONTROLLED DATA OR ANY PRODUCTS OR SERVICES DERIVED FROM THE ICGC
        CONTROLLED DATA. IF THE UNIVERSITY IS OBLIGATED TO RESPOND TO A THIRD PARTY SUBPOENA OR
        OTHER COMPULSORY LEGAL ORDER OR PROCESS, YOU WILL ALSO REIMBURSE THE UNIVERSITY FOR ALL
        REASONABLE FEES ASSOCIATED THEREWITH.
      </TextComponent>
    </ListComponent>
  ),
];

export default termsAndConditionsList;
