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

import { Svg, G, Rect, Path } from '@react-pdf/renderer';

const FilledCheckbox = () => {
  return (
    <Svg width="11" height="11" viewBox="0 0 11 11">
      <G fill="none" fill-rule="evenodd">
        <G>
          <G>
            <G>
              <G>
                <G>
                  <G transform="translate(-109.000000, -759.000000) translate(100.000000, 34.000000) translate(1.000000, 666.000000) translate(0.000000, 51.000000) translate(8.000000, 8.000000)">
                    <Rect width="11" height="11" fill="#0774D3" rx="2" x="0" y="0" ry="2" />
                    <G fill="#FFF">
                      <Path
                        style={{ transform: 'translate(1, 2)' }}
                        d="M0.25275,4.737 C-0.51975,3.9645 0.65475,2.79 1.42725,3.5625 L2.91975,5.055 L7.57275,0.40275 C8.34525,-0.36975 9.51975,0.80475 8.74725,1.57725 L3.507,6.81675 C3.183,7.1415 2.65725,7.1415 2.3325,6.81675 L0.25275,4.737 Z"
                      />
                    </G>
                  </G>
                </G>
              </G>
            </G>
          </G>
        </G>
      </G>
    </Svg>
  );
};

export default FilledCheckbox;
