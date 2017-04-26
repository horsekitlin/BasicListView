/**
 * @flow
 */

import React, { PropTypes } from 'react';
import {
    RefreshControl,
    VirtualizedList,
} from 'react-native';
import _ from 'lodash';

const Immutable = require('immutable');

export default class BasicListView extends React.PureComponent {
    static propTypes = {
        //dataSource: PropTypes.instanceOf(Immutable.List).isRequired,
        loadMore: PropTypes.func.isRequired,
        refresh: PropTypes.func.isRequired,
        isRefreshing: PropTypes.bool.isRequired,
        renderRow: PropTypes.func.isRequired,
        windowSize: PropTypes.number,
        onEndReachedThreshold: PropTypes.number,
    };

    static defaultProps = {
        onEndReachedThreshold: 2,
    };

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
    _getItem = (data: Immutable.Map, index: number) => {
        return data.get(index);
    }

    _getItemCount = (data: Immutable.Map) => {
        return data.size;
    }

    _keyExtractor = (data: Immutable.Map, index: number) => {
        const key = this.props.keyExtractor(data, index);
        return key;
    }
    render() {
        const {
            dataSource,
            onEndReachedThreshold,
            windowSize,
            isRefreshing,
            refresh,
            loadMore,
            renderRow,
        } = this.props;
        return (
            <VirtualizedList
                style={{ flex: 1 }}
                onRefresh={refresh}
                onEndReachedThreshold={onEndReachedThreshold}
                onEndReached={loadMore}
                getItem={this._getItem}
                refreshing={isRefreshing}
                getItemCount={this._getItemCount}
                keyExtractor={this._keyExtractor}
                renderItem={renderRow}
                data={dataSource}
                windowSize={windowSize}
            />
        );
    }

    refresh = () => {
        if (_.isFunction(this.props.refresh)) {
            this.props.refresh();
        }
    }
}