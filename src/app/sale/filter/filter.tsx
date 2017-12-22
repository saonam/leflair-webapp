import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';

import { Grid } from '../../common';

import FilterOption from './filter-option';

import * as styles from './filter.scss';

class FilterComponent extends Component<any, any> {
  constructor(props: {name: string, options: any[], selected: string[], onSelect: Function, t: Function}) {
    super(props);

    this.state = {
      collapsed: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  render() {
    return (
      <div className={styles.filterContainer} key={this.props.name}>
        <div className={styles.filterHeader}>
          <h5 className="clearfix">
            <a className="clearfix d-block" href="javascript:void(0)" id={this.props.name} onClick={this.toggle}>
              <span className="float-left">{this.props.t(`sales:${this.props.name.toUpperCase()}`)}</span>
              <i className={`fa float-right ${this.state.collapsed ? 'ic-ic-plus' : 'ic-ic-minus'}`}></i>
            </a>
          </h5>
        </div>
        {!this.state.collapsed && (
          <div>
            <Grid
              data={this.props.options.map((o: any) => Object.assign(o, {
                filterName: this.props.name,
                isActive: this.props.selected && this.props.selected.indexOf(this.props.name === 'color' ? o.display : o.value) !== -1,
                onSelect: this.props.onSelect
              }))}
              component={FilterOption}
              columns={this.props.name === 'brand' || this.props.name === 'category' ? 1 : 2}
            />
          </div>
        )}
      </div>
    )
  }
}

export default translate(['sales'])(FilterComponent);
