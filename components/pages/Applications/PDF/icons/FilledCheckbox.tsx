import { Svg, G, Rect, Path } from '@react-pdf/renderer';

const FilledCheckbox = () => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
      <G fill="none" fill-rule="evenodd">
        <G>
          <G>
            <G>
              <G>
                <G>
                  <G transform="translate(-109.000000, -759.000000) translate(100.000000, 34.000000) translate(1.000000, 666.000000) translate(0.000000, 51.000000) translate(8.000000, 8.000000)">
                    <Rect width="16" height="16" fill="#0774D3" rx="2" x="0" y="0" ry="2" />
                    <G fill="#FFF">
                      <Path
                        style={{ transform: 'translate(2, 2)' }}
                        d="M.337 7.316C-.693 6.286.873 4.72 1.903 5.75l1.99 1.99 6.204-6.203c1.03-1.03 2.596.536 1.566 1.566l-6.987 6.986c-.432.433-1.133.433-1.566 0L.337 7.316z"
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
