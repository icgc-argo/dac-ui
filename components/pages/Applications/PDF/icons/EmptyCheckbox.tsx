import { Svg, G, Rect } from '@react-pdf/renderer';

const EmptyCheckbox = () => {
  return (
    <Svg width="11" height="11" viewBox="0 0 11 11">
      <G fill="none" fill-rule="evenodd">
        <G fill="#FFF" stroke="#BABCC2">
          <G>
            <G>
              <G>
                <G>
                  <G>
                    <G transform="translate(-110.000000, -511.000000) translate(100.000000, 34.000000) translate(1.000000, 346.000000) translate(1.000000, 124.000000) translate(8.000000, 7.000000)">
                      <Rect width="11" height="11" rx="2" x="0" y="0" ry="2" />
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

export default EmptyCheckbox;
