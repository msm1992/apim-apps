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

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { Grid, Tooltip, Typography } from '@mui/material';
import { ToggleButton, ToggleButtonGroup } from '@mui/lab';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

export const violationSeverityMap = {
    'ERROR': <ErrorIcon color='error' />,
    'WARN': <WarningIcon color='warning' />,
    'INFO': <InfoIcon color='info' />,
};

const GovernanceViolationsSummary = ({ violations, handleChange }) => {
    const [selectedSeverity, setSelectedSeverity] = useState(null);
    const severityCounts = {};

    if (violations) {
        violations.forEach(({ severity }) => {
            severityCounts[severity] = severityCounts[severity] + 1 || 1;
        });
    }

    return (
        <Box ml={3}>
            <Tooltip title={
                `Error: ${severityCounts.error || 0}, ` +
                `Warning: ${severityCounts.warning || 0}, ` +
                `Info: ${severityCounts.info || 0}`
            }>
                <ToggleButtonGroup
                    exclusive
                    value={selectedSeverity}
                    size='small'
                    onChange={(event, value) => {
                        setSelectedSeverity(value);
                        handleChange(event, value);
                    }}
                >
                    {Object.entries(violationSeverityMap).map(([severity, component]) => (
                        <ToggleButton
                            key={severity}
                            value={severity}
                        >
                            <Box ml={1} display='flex'>
                                {component}
                                <Grid item>
                                    <Box maxWidth='2rem'>
                                        <Typography noWrap>
                                            &nbsp;{severityCounts[severity] || 0}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Box>
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </Tooltip>
        </Box >
    );
};

export default GovernanceViolationsSummary;
