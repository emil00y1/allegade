import {definePlugin} from 'sanity'
import {BarChartIcon} from '@sanity/icons'
import {AnalyticsDashboard} from './AnalyticsDashboard'

export const analyticsDashboard = definePlugin(() => ({
  name: 'analytics-dashboard',
  tools: [
    {
      name: 'analytics',
      title: 'Analytics',
      icon: BarChartIcon,
      component: AnalyticsDashboard,
    },
  ],
}))

export default analyticsDashboard
