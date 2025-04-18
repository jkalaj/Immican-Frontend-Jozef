// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline'
import FileCodeOutline from 'mdi-material-ui/FileCodeOutline'
import Account from 'mdi-material-ui/Account'
import FrequentlyAskedQuestions from 'mdi-material-ui/CrosshairsQuestion'
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import Payment from 'mdi-material-ui/Email'
import Manage from 'mdi-material-ui/Poll'
import CircleSmall from 'mdi-material-ui/CircleSmall'
import StarOutline from 'mdi-material-ui/StarOutline'
import MapOutline from 'mdi-material-ui/MapOutline'

const ImmigrantMenu = () => {
  return [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/immigrant/dashboard'
    },
    {
      title: 'immiAI',
      icon: FileCodeOutline,
      path: '/immiAI'
    },
    {
      title: 'Immi Score',
      icon: StarOutline,
      path: '/immigrant/immiscore'
    },
    {
      title: 'Roadmap',
      icon: MapOutline,
      path: '/immigrant/roadmap'
    },
    {
      title: 'Service',
      icon: HomeRepairServiceIcon,
      path: '/service'
    },
    {
      title: 'Manage',
      icon: Manage,
      children: [
        {
          title: 'My Goal',
          icon: CircleSmall,
          path: '/myGoal'
        },
        {
          title: 'My Unimo',
          icon: CircleSmall,
          path: '/immigrant/dashboard/myUnimo'
        },
        {
          title: 'My Calendar',
          icon: CircleSmall,
          path: '/myCalendar'
        },
      ]
    },
    {
      title: 'Payment',
      icon: Payment,
      children: [
        {
          title: 'Invoice',
          icon: CircleSmall,
          path: '/invoice'
        },
        {
          title: 'Platform',
          icon: CircleSmall,
          path: '/platform'
        },
      ]
    },
    {
      title: 'Profile',
      icon: Account,
      children: [
        {
          title: 'My Story',
          icon: CircleSmall,
          path: '/dashboard/pages/myStory'
        },
        {
          title: 'Edit Profile',
          icon: CircleSmall,
          path: '/immigrant/dashboard/editProfile'
        },
        {
          title: 'Upload Document',
          icon: CircleSmall,
          path: '/immigrant/dashboard/uploadDocument'
        },
        {
          title: 'View Profile',
          icon: CircleSmall,
          path: '/dashboard/pages/viewProfile'
        },
        {
          title: 'Profile View Allow',
          icon: CircleSmall,
          path: '/dashboard/pages/profileViewAllow'
        },
        {
          title: 'Family Member',
          icon: CircleSmall,
          path: '/immigrant/dashboard/familyMember'
        },
      ]
    },
    {
      title: 'F.A.Q',
      icon: FrequentlyAskedQuestions,
      path: '/faq'
    },
    {
      title: 'Open Ticket',
      icon: FileCodeOutline,
      path: '/tickets'
    },
  ]
}

export default ImmigrantMenu
