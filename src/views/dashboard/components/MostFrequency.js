import React, { useEffect, useState } from 'react';
import DashboardCard from '../../../components/shared/DashboardCard';
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  timelineOppositeContentClasses,
} from '@mui/lab';
import { Link, Typography } from '@mui/material';
import { useTheme } from '@emotion/react';

const MostFrequency = (props) => {
  const data = props.data;
  const theme = useTheme();

  return (
    <DashboardCard title="Most Frequency">
      <>
        <Timeline
          className="theme-timeline"
          nonce={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
          sx={{
            p: 0,
            mb: '-40px',
            '& .MuiTimelineConnector-root': {
              width: '1px',
              backgroundColor: '#efefef'
            },
            [`& .${timelineOppositeContentClasses.root}`]: {
              flex: 0.5,
              paddingLeft: 0,
            },
          }}
        >
          <TimelineItem>
            <TimelineOppositeContent>Product Code</TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="secondary" variant="outlined" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography fontWeight="600">
                {data && data[0] ? data[0].name : ""}
              </Typography>{' '}
              <Link href="#" underline="none" color={theme.palette.secondary.main}>
                {data && data[0] ? data[0].frequency + " 종류" : ""}
              </Link>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineOppositeContent>Product Category</TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="error" variant="outlined" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography fontWeight="600">
                {data && data[1] ? data[1].name : ""}
              </Typography>{' '}
              <Link href="#" underline="none" color={theme.palette.secondary.main}>
                {data && data[1] ? data[1].frequency + " 종류" : ""}
              </Link>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineOppositeContent>Order Demand</TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="success" variant="outlined" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography fontWeight="600">
                {data && data[2] ? data[2].most : ""}
              </Typography>{' '}
              <Link href="#" underline="none" color={theme.palette.secondary.main}>
                {data && data[2] ? data[2].count + " 건수" : ""}
              </Link>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineOppositeContent>Ware house</TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="warning" variant="outlined" />
            </TimelineSeparator>
            <TimelineContent>
              <Typography fontWeight="600">
                {data && data[3] ? data[3].name : ""}
              </Typography>{' '}
              <Link href="#" underline="none" color={theme.palette.secondary.main}>
                {data && data[3] ? data[3].frequency + " 종류" : ""}
              </Link>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
        <br/>
      </>
    </DashboardCard>
  );
};

export default MostFrequency;
