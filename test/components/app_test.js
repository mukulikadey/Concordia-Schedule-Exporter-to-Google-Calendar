import {renderComponent, expect} from '../test_helper';
import App from '../../src/app/components/app';
import FireBaseTools from '../../src/app/utils/firebase';


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
  let noClassThisDay = new Array();

  FireBaseTools.fillNoClassThisDay(noClassThisDay);
  it('fill', () => {
      expect(noClassThisDay.length).greaterThan(0);
  });
});