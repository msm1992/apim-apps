/*
 * Copyright (c) 2025, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import Typography from '@mui/material/Typography';
import {
    Chip, Stack, Tooltip, Button,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import ListBase from 'AppComponents/AdminPages/Addons/ListBase';
import GovernanceAPI from 'AppData/GovernanceAPI';
import Utils from 'AppData/Utils';
import DeletePolicy from './DeletePolicy';

/**
 * API call to get Policies
 * @returns {Promise}.
 */
function apiCall() {
    const restApi = new GovernanceAPI();
    return restApi
        .getPoliciesList()
        .then((result) => {
            return result.body.list;
        })
        .catch((error) => {
            throw error;
        });
}

/**
 * Render a list of policies
 * @returns {JSX} List component
 */
export default function ListPolicies() {
    const intl = useIntl();

    const columProps = [
        {
            name: 'name',
            label: intl.formatMessage({
                id: 'Governance.Policies.List.column.policy',
                defaultMessage: 'Policy',
            }),
            options: {
                sort: true,
                customBodyRender: (value, tableMeta) => {
                    const dataRow = tableMeta.rowData;
                    return (
                        <>
                            {/* TODO: Add text wrapping */}
                            <Typography>{value}</Typography>
                            <Typography
                                variant='caption'
                                display='block'
                                color='textSecondary'
                            >
                                {dataRow[1]}
                            </Typography>
                        </>
                    );
                },
                setCellProps: () => ({
                    style: {
                        width: '35%',
                    },
                }),
            },
        },
        {
            name: 'description',
            options: { display: false },
        },
        {
            name: 'governableStates',
            label: intl.formatMessage({
                id: 'Governance.Policies.List.column.appliesWhen',
                defaultMessage: 'Applies when',
            }),
            options: {
                sort: false,
                customBodyRender: (value) => {
                    if (!value?.length) return 'Not set';
                    const displayItems = value.slice(0, 2);
                    const remainingCount = value.length - 2;

                    return (
                        <Tooltip
                            title={value.map((label) => Utils.mapGovernableStateToLabel(label)).join(', ')}
                            arrow
                        >
                            <Stack direction='row' spacing={0.5} alignItems='center'>
                                {displayItems.map((label) => (
                                    <Chip
                                        key={label}
                                        label={Utils.mapGovernableStateToLabel(label)}
                                        size='small'
                                        variant='outlined'
                                        color='primary'
                                    />
                                ))}
                                {remainingCount > 0 && (
                                    <Typography
                                        variant='caption'
                                        color='primary'
                                    >
                                        +
                                        {remainingCount}
                                    </Typography>
                                )}
                            </Stack>
                        </Tooltip>
                    );
                },
                setCellProps: () => ({
                    style: {
                        width: '25%',
                    },
                }),
            },
        },
        {
            name: 'labels',
            label: intl.formatMessage({
                id: 'Governance.Policies.List.column.appliesTo',
                defaultMessage: 'Applies to',
            }),
            options: {
                sort: false,
                customBodyRender: (value) => {
                    if (!value?.length) return 'All';
                    const displayItems = value.slice(0, 2);
                    const remainingCount = value.length - 2;

                    return (
                        <Tooltip
                            title={value.join(', ')}
                            arrow
                        >
                            <Stack direction='row' spacing={0.5} alignItems='center'>
                                {displayItems.map((label) => (
                                    <Chip
                                        key={label}
                                        label={label}
                                        size='small'
                                        variant='outlined'
                                        color='info'
                                    />
                                ))}
                                {remainingCount > 0 && (
                                    <Typography
                                        variant='caption'
                                        color='info.main'
                                    >
                                        +
                                        {remainingCount}
                                    </Typography>
                                )}
                            </Stack>
                        </Tooltip>
                    );
                },
                setCellProps: () => ({
                    style: {
                        width: '25%',
                    },
                }),
            },
        },
        {
            name: 'id',
            options: { display: false },
        }, // Id column has to be always the last since it is used in the actions.
    ];

    const pageProps = {
        pageStyle: 'paperLess',
        title: intl.formatMessage({
            id: 'Governance.Policies.List.title',
            defaultMessage: 'Governance Policies',
        }),
        pageDescription: intl.formatMessage({
            id: 'Governance.Policies.List.description',
            defaultMessage: 'Create governance policies using rulesets from the catalog'
                + ' to standardize and regulate your APls effectively',
        }),
    };

    const addButtonProps = {
        triggerButtonText: intl.formatMessage({
            id: 'Governance.Policies.List.addPolicy.triggerButtonText',
            defaultMessage: 'Create Governance Policy',
        }),
        title: intl.formatMessage({
            id: 'Governance.Policies.List.addPolicy.title',
            defaultMessage: 'Create Governance Policy',
        }),
    };

    const searchProps = {
        searchPlaceholder: intl.formatMessage({
            id: 'Governance.Policies.List.search.default',
            defaultMessage: 'Search policies by name or label',
        }),
        active: true,
    };

    const emptyBoxProps = {
        content: (
            <Typography variant='body2' color='textSecondary' component='p'>
                <FormattedMessage
                    id='Governance.Policies.List.empty.content'
                    defaultMessage={'Governance policies help you enforce standards'
                        + ' and compliance across your APIs. Click the Create button'
                        + ' to add your first policy.'}
                />
            </Typography>
        ),
        title: (
            <Typography gutterBottom variant='h5' component='h2'>
                <FormattedMessage
                    id='Governance.Policies.List.empty.title'
                    defaultMessage='Governance Policies'
                />
            </Typography>
        ),
    };

    const addButtonOverride = (
        <RouterLink to='/governance/policies/create'>
            <Button
                variant='contained'
                color='primary'
                size='small'
                role='button'
            >
                <FormattedMessage
                    id='Governance.Policies.List.add.new.policy'
                    defaultMessage='Create Policy'
                />
            </Button>
        </RouterLink>
    );

    return (
        <ListBase
            columProps={columProps}
            pageProps={pageProps}
            addButtonProps={addButtonProps}
            searchProps={searchProps}
            emptyBoxProps={emptyBoxProps}
            apiCall={apiCall}
            DeleteComponent={DeletePolicy}
            editComponentProps={{
                icon: <EditIcon />,
                title: intl.formatMessage({
                    id: 'Governance.Policies.List.edit.title',
                    defaultMessage: 'Edit Policy',
                }),
                routeTo: '/governance/policies/',
            }}
            addButtonOverride={addButtonOverride}
        />
    );
}
