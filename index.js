/**
 * @flow
 */

import React, { PropTypes } from 'react';
import {
   ListView,
   RefreshControl,
   View,
   Text,
 } from 'react-native';

import SGListView from 'react-native-sglistview';
import _ from 'lodash';

const Immutable = require('immutable');

const dataSource = new ListView.DataSource({
    rowHasChanged: (r1, r2) => !Immutable.is(r1, r2),
    getRowData: (dataBlob, sectionID, rowID) => { return dataBlob[sectionID].get(rowID); }
});

export default class BasicListView extends React.Component{
    static propTypes = {
        //dataSource: PropTypes.instanceOf(Immutable.List).isRequired,
        loadMore: PropTypes.func.isRequired,
        refresh: PropTypes.func.isRequired,
        isRefreshing: PropTypes.bool.isRequired,
        renderRow: PropTypes.func.isRequired,
        pageSize: PropTypes.number,
        initialListSize: PropTypes.number,
        stickyHeaderIndices: PropTypes.array,
        onEndReachedThreshold: PropTypes.number,
        renderSectionHeader: PropTypes.func,
        renderFooter : PropTypes.func,
    };

    static defaultProps = {
        pageSize: 30,
        initialListSize: -1,
        stickyHeaderIndices: [],
        scrollRenderAheadDistance: 0,
        onEndReachedThreshold: 0,
    };

    constructor(props){
        super(props);
        this._getDataSource = new ListView.DataSource({
          rowHasChanged: (r1, r2) => !Immutable.is(r1, r2),
          getRowData: (dataBlob, sectionID, rowID) => { return dataBlob[sectionID].get(rowID); }
        });

    }
    getContent = () => {
        const {
            dataSource,
        } = this.props;
        const postCount = dataSource.size;
        rowIds = (count => [...Array(count)].map((val, i) => i))(postCount);
        return this._getDataSource.cloneWithRows(dataSource, rowIds);
    }

    loadMore = () => {
        if (this.props.canLoadMore) {
            this.props.loadMore();
        }
    }
    render(){
        const {
            pageSize,
            initialListSize,
            stickyHeaderIndices,
            scrollRenderAheadDistance,
            onEndReachedThreshold,
        } = this.props;
        return (
            <SGListView
                style={{flex: 1}}    
               refreshControl={
                   <RefreshControl
                       onRefresh={this.refresh}
                       refreshing={this.props.isRefreshing} />
               }
               enableEmptySections={true}
               pageSize={pageSize} 
               renderSectionHeader={this.props.renderSectionHeader}
               initialListSize={initialListSize}
               renderFooter={this.props.renderFooter}
               stickyHeaderIndices={stickyHeaderIndices}
               onEndReachedThreshold={onEndReachedThreshold}
               onEndReached={this.loadMore}
               style={this.props.style}
               scrollRenderAheadDistance={scrollRenderAheadDistance}
               renderRow={this.props.renderRow}
               dataSource={this.getContent()} />
        );
    }

    refresh = () => {
        if(_.isFunction(this.props.refresh)){
            this.props.refresh();
        }
    }
}