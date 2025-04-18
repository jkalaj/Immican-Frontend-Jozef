// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline'
import FileCodeOutline from 'mdi-material-ui/FileCodeOutline'
import Account from 'mdi-material-ui/Account'
import FrequentlyAskedQuestions from 'mdi-material-ui/CrosshairsQuestion'
import MessageOutline from 'mdi-material-ui/ChatOutline'
import Building from 'mdi-material-ui/Domain'
import Payment from 'mdi-material-ui/Email'
import Manage from 'mdi-material-ui/Poll'
import CircleSmall from 'mdi-material-ui/CircleSmall'

const navigation = () => {
  return [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/dashboard'
    },
    {
      title: 'ImmiAI',
      icon: FileCodeOutline,
      path: '/immiAI'
    },
    {
      title: 'Manage',
      icon: Manage,
      children: [
        {
          title: 'My Service',
          icon: CircleSmall,
          path: '/dashboard/pages/myService'
        },
        {
          title: 'My Unimo',
          icon: CircleSmall,
          path: '/dashboard/pages/myUnimo'
        },
        {
          title: 'My Calendar',
          icon: CircleSmall,
          path: '/myCalendar'
        },
        {
          title: 'My Clients',
          icon: CircleSmall,
          path: '/dashboard/pages/myClients'
        },
        {
          title: 'Team',
          icon: CircleSmall,
          path: '/dashboard/pages/team'
        },
      ]
    },
    {
      title: 'Payment',
      icon: Payment,
      children: [
        {
          title: 'View Invoice',
          icon: CircleSmall,
          path: '/dashboard/pages/invoice'
        },
        {
          title: 'Manage Invoice',
          icon: CircleSmall,
          path: '/dashboard/pages/manageInvoice'
        },
        {
          title: 'Platform Subscription',
          icon: CircleSmall,
          path: '/dashboard/pages/subscription'
        },
      ]
    },
    {
      title: 'Business Organization',
      icon: Building,
      children: [
        {
          title: 'My Story',
          icon: CircleSmall,
          path: '/dashboard/pages/businessOrganization/myStory'
        },
        {
          title: 'Edit Profile',
          icon: CircleSmall,
          path: '/dashboard/pages/businessOrganization/editProfile'
        },
        {
          title: 'Upload Document',
          icon: CircleSmall,
          path: '/dashboard/pages/businessOrganization/uploadDocument'
        },
        {
          title: 'View Profile',
          icon: CircleSmall,
          path: '/dashboard/pages/businessOrganization/viewProfile'
        },
        {
          title: 'Profile View Allow',
          icon: CircleSmall,
          path: '/dashboard/pages/businessOrganization/profileViewAllow'
        },
        {
          title: 'Review Feedback',
          icon: CircleSmall,
          path: '/dashboard/pages/businessOrganization/review'
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
          path: '/dashboard/pages/editProfile'
        },
        {
          title: 'View Profile',
          icon: CircleSmall,
          path: '/dashboard/pages/viewProfile'
        },
        {
          title: 'View Profile Allow',
          icon: CircleSmall,
          path: '/dashboard/pages/profileViewAllow'
        },
      ]
    },
    {
      title: 'Communication Channel',
      icon: MessageOutline,
      children: [
        {
          title: 'External Chat',
          icon: CircleSmall,
          path: '/dashboard/pages/chat'
        },
        {
          title: 'Internal Chat',
          icon: CircleSmall,
          path: '/dashboard/pages/internalChat'
        },
        {
          title: 'Calender',
          icon: CircleSmall,
          path: '/dashboard/pages/calender'
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

export default navigation
