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
