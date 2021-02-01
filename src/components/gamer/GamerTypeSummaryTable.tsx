import UtilityService from '../../services/UtilityService';
import {Box, Table, TableBody, TableData, Text, Small, TableHead, TableHeader, TableRow} from '../SimpleComponents';
import {Gamer} from './GamerTypes';


type GamerTypeSummaryTableProps = {
    gamer: Gamer
};

export default function GamerTypeSummaryTable(props: GamerTypeSummaryTableProps) {
    const {gamer} = props;

    const typeList = [
        {
            key: 'overall',
            label: 'Overall',
            keyReplacement: {
                last_100_overall_rolling_average_kdr: 'last_100_rolling_average_kdr',
                overall_max_kills: 'max_kills',
            }
        },
        {
            key: 'solo',
            maxTeams: 150,
            top10Percent: 15,
        },
        {
            key: 'duo',
            maxTeams: 75,
            top10Percent: 8,
        },
        {
            key: 'trio',
            maxTeams: 50,
            top10Percent: 5,
        },
        {
            key: 'quad',
            maxTeams: 37,
            top10Percent: 4,
        }
    ];
    const valueList = [

        {
            label: 'Last 100 KDR',
            key: 'last_100_{{type}}_rolling_average_kdr',
            value: (value, type) => {
                return UtilityService.round(value || 0, 2);
            }
        },
        {
            label: 'Top 10 Placement Rate',
            key: '{{type}}_top_10_rate',
            value: (value, type) => {
                return (
                    <Text>
                        {UtilityService.numberToPercentage(value || 0, 1) } {type && type.top10Percent ? <Small>({'<=10'})</Small> : ''}
                    </Text>
                );
            }
        },
        {
            label: 'Top 10% Placement Rate',
            key: '{{type}}_top_10_percent_rate',
            value: (value, type) => {
                return (
                    <Text>
                        {UtilityService.numberToPercentage(value || 0, 1) } {type && type.top10Percent ? <Small>({'<=' + type.top10Percent})</Small> : ''}
                    </Text>
                );
            }
        },
        {
            label: 'Win Rate',
            key: '{{type}}_win_rate',
            value: (value, type) => {
                return UtilityService.numberToPercentage(value, 2);
            }
        },
        {
            label: 'Wins',
            key: '{{type}}_wins',
            value: (value, type) => {
                return value || 0;
            }
        },
        {
            label: 'Matches',
            key: '{{type}}_match_count',
            value: (value, type) => {
                return value || 0;
            }
        },
        {
            label: 'Average Placement',
            key: 'avg_{{type}}_placement',
            value: (value, type) => {
                return (
                    <Text>
                        {(value ? UtilityService.round(value, 1) : '-')} {type && type.maxTeams ? <Small>(of ~{type.maxTeams})</Small> : ''}
                    </Text>
                );
            }
        },
        {
            label: 'Most Kills',
            key: '{{type}}_max_kills',
            value: (value, type) => {
                return value || 0;
            }
        }
    ];

    return (
        <Box>

            <Box>
                <Table striped responsive>
                    <TableHead>
                        <TableRow>
                            <TableHeader/>

                            {
                                typeList.map(({key, label}) => {
                                    return (
                                        <TableHeader>
                                            {label || UtilityService.camelToProperCase(key) + 's'}
                                        </TableHeader>
                                    );
                                })
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            valueList.map(({label, key, value}) => {
                                return (
                                    <TableRow>
                                        <TableHeader align={'left'}>
                                            {label}
                                        </TableHeader>

                                        {
                                            typeList.map((type) => {
                                                let typeKey = key.replace('{{type}}', type.key);

                                                if (type.keyReplacement && type.keyReplacement[typeKey]) {
                                                    typeKey = type.keyReplacement[typeKey];
                                                }

                                                const typeValue = gamer[typeKey];
                                                const displayedValue = value(typeValue, type);

                                                return (
                                                    <TableData align={'right'}>
                                                        {displayedValue}
                                                    </TableData>
                                                );
                                            })
                                        }
                                    </TableRow>
                                );
                            })
                        }
                    </TableBody>
                </Table>
            </Box>
        </Box>
    );
}