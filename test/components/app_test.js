import {renderComponent, expect} from '../test_helper';
import App from '../../src/app/components/app';
import populate from '../../src/app/utils/firebase';
/* eslint-disable */
import { describe, it } from '../../chutzpah/Samples/Angular/libs/typings/jasmine/jasmine';
/* eslint-enable */

describe('App', () => {
  let component;

  beforeEach(() => {
    component = renderComponent(App);
  });

  it('renders something', () => {
    expect(component).to.exist;
  });
});

describe('fillNoClassThisDay', () => {
  let noClassThisDay;

  populate(noClassThisDay);
  /* eslint-disable */
  it('populate', () => {
      expect(noClassThisDay).length.Chai.NumericComparison.greaterThan(0, 'Array must not be empty');
  });
  /* eslint-enable*/
});