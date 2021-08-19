/*
 * Copyright (c) 2021 The Ontario Institute for Cancer Research. All rights reserved
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

import { css } from '@emotion/core';
import Typography from '@icgc-argo/uikit/Typography';
import PageHeader from 'components/PageHeader';
import { Container, Row } from 'react-grid-system';
import Applications from './Applications';
import AccessBox from './AccessBox';

const Dashboard = ({ hasDacoAccess }: { hasDacoAccess: boolean }) => (
  <>
    <PageHeader>My Applications</PageHeader>
    <Container
      css={css`
        margin-top: 24px;
      `}
    >
      <Row
        css={css`
          justify-content: space-between;
          margin-bottom: 57px;
        `}
        nogutter
      >
        <div
          css={css`
            display: flex;
            justify-content: space-between;
            align-items: center;
          `}
        >
          <Typography
            variant="paragraph2"
            css={css`
              margin-right: 80px;
            `}
          >
            This is where you can manage your Applications for Access to ICGC Controlled Data.
            Access will be granted for a <b>two year period</b>, starting from the date of approval
            by the ICGC DACO.
          </Typography>
          <AccessBox hasAccess={hasDacoAccess} />
        </div>
      </Row>
      <Applications />
    </Container>
  </>
);

export default Dashboard;
