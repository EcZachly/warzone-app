import {Image, Show, Small, Text} from '../SimpleComponents';
import UtilityService from '../../services/UtilityService';
import {COLORS} from '../../config/CONSTANTS';



export default function PlacementIndicator(props) {
    const {placement, teamCount} = props;

    const placementPercentage = placement / teamCount;
    const teamWon = (placement === 1);
    const topTenPercent = teamWon === false && placementPercentage <= .10;
    const placementPercentagePretty = 'Top ' + UtilityService.numberToPercentage(placementPercentage, 0);
    const emphasizePlacement = teamWon || topTenPercent;

    const wonColor = COLORS.BRIGHT_YELLOW;
    const topTenColor = COLORS.BRIGHT_BLUE;

    const emphasisColor = (teamWon ? wonColor : topTenPercent ? topTenColor : 'inherit');

    return (
        <>
            <Show show={teamWon}>
                <Image style={{height: '.75em'}}
                       src={'/assets/images/icons/trophy-sm-yellow.png'}
                       alt={'winner trophy'}/>
            </Show> <Show show={topTenPercent}>
            <Image style={{height: '.85em', position: 'relative', top: '2px'}}
                   src={'/assets/images/icons/ribbon-sm-blue.png'}
                   title={'top 10%'}
                   alt={'top 10% ribbon'}/>
            </Show> <Text bold={emphasizePlacement}
                          style={{color: emphasisColor}}>
                {placement} of {teamCount}
            </Text> <Small>
                <Text bold={topTenPercent} style={{color: topTenPercent ? topTenColor : 'inherit'}}>
                    ({placementPercentagePretty})
                </Text>
            </Small>
        </>
    );
}