// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import ImmigrantLayout from 'src/layouts/ImmigrantLayout'

// ** Custom Components
const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.MuiLinearProgress-colorPrimary`]: {
    backgroundColor: theme.palette.primary.main
  },
  [`& .MuiLinearProgress-bar`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.success.main
  }
}))

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))

const ImmiScore = () => {
  // Define the scoring criteria for each category
  const scoringCriteria = {
    education: {
      degree: {
        'No Degree': 0,
        'High School': 25,
        'Bachelor Degree': 55,
        'Master Degree': 75,
        'PhD': 100
      },
      languageProficiency: {
        'None': 0,
        'Basic': 20,
        'Intermediate': 45,
        'Advanced': 75,
        'Native/Bilingual': 100
      },
      certification: {
        'None': 0,
        'Professional Certification': 40,
        'Industry Specific': 60
      }
    },
    workExperience: {
      years: {
        'No experience': 0,
        'Less than 1 year': 15,
        '1-2 years': 30,
        '2-3 years': 45,
        '3-4 years': 60,
        '4-5 years': 75,
        '5-6 years': 85,
        '6+ years': 100
      },
      skillLevel: {
        'Entry Level': 20,
        'Junior': 40,
        'Intermediate': 60,
        'Senior Level': 80,
        'Expert/Specialist': 100
      },
      relevancy: {
        'Not Relevant': 0,
        'Somewhat Relevant': 40,
        'Mostly Relevant': 70,
        'Highly Relevant': 100
      }
    },
    age: {
      ageRange: {
        'Under 18': 20,
        '18-25': 70,
        '26-35': 100,
        '36-45': 60,
        'Over 45': 40
      }
    },
    adaptability: {
      relativesInCountry: {
        'None': 30,
        'Distant Relatives': 60,
        'Close Relatives': 100
      },
      previousVisits: {
        'Never': 30,
        '1-2 visits': 65,
        '3+ visits': 100
      }
    }
  }

  // State for selected values
  const [selections, setSelections] = useState({
    education: {
      degree: 'Bachelor Degree',
      languageProficiency: 'Advanced',
      certification: 'Professional Certification'
    },
    workExperience: {
      years: '3-4 years',
      skillLevel: 'Senior Level',
      relevancy: 'Highly Relevant'
    },
    age: {
      ageRange: '26-35'
    },
    adaptability: {
      relativesInCountry: 'None',
      previousVisits: 'Never'
    }
  })

  // Calculate category scores with weighted factors
  const calculateCategoryScore = (category, selections) => {
    const weights = {
      education: {
        degree: 0.5,
        languageProficiency: 0.35,
        certification: 0.15
      },
      workExperience: {
        years: 0.4,            // 40% weight for years of experience
        skillLevel: 0.3,       // 30% weight for skill level
        relevancy: 0.3         // 30% weight for relevancy
      },
      age: {
        ageRange: 1
      },
      adaptability: {
        relativesInCountry: 0.6,
        previousVisits: 0.4
      }
    }

    const factors = Object.keys(selections)
    let totalScore = 0
    let totalWeight = 0

    factors.forEach(factor => {
      const factorScore = scoringCriteria[category][factor][selections[factor]]
      const weight = weights[category][factor]
      totalScore += factorScore * weight
      totalWeight += weight
    })

    // Ensure we don't divide by zero
    return Math.round(totalWeight > 0 ? totalScore : 0)
  }

  // Calculate overall score with category weights
  const calculateOverallScore = () => {
    const weights = {
      education: 0.35,
      workExperience: 0.30,
      age: 0.20,
      adaptability: 0.15
    }

    const scores = {
      education: calculateCategoryScore('education', selections.education),
      workExperience: calculateCategoryScore('workExperience', selections.workExperience),
      age: calculateCategoryScore('age', selections.age),
      adaptability: calculateCategoryScore('adaptability', selections.adaptability)
    }

    let totalScore = 0
    Object.keys(weights).forEach(category => {
      totalScore += scores[category] * weights[category]
    })

    return Math.round(totalScore)
  }

  const handleSelectionChange = (category, factor, value) => {
    // Map displayed category names to state keys
    const categoryKeyMap = {
      'Education': 'education',
      'Work Experience': 'workExperience',
      'Age': 'age',
      'Adaptability': 'adaptability'
    }
    
    const categoryKey = categoryKeyMap[category]
    
    setSelections(prev => ({
      ...prev,
      [categoryKey]: {
        ...prev[categoryKey],
        [factor]: value
      }
    }))
  }

  // Format categories for display
  const categories = [
    {
      name: 'Education',
      score: calculateCategoryScore('education', selections.education),
      factors: Object.entries(selections.education).map(([key, value]) => `${key}: ${value}`),
      selections: selections.education,
      criteria: scoringCriteria.education
    },
    {
      name: 'Work Experience',
      score: calculateCategoryScore('workExperience', selections.workExperience),
      factors: Object.entries(selections.workExperience).map(([key, value]) => `${key}: ${value}`),
      selections: selections.workExperience,
      criteria: scoringCriteria.workExperience
    },
    {
      name: 'Age',
      score: calculateCategoryScore('age', selections.age),
      factors: Object.entries(selections.age).map(([key, value]) => `${key}: ${value}`),
      selections: selections.age,
      criteria: scoringCriteria.age
    },
    {
      name: 'Adaptability',
      score: calculateCategoryScore('adaptability', selections.adaptability),
      factors: Object.entries(selections.adaptability).map(([key, value]) => `${key}: ${value}`),
      selections: selections.adaptability,
      criteria: scoringCriteria.adaptability
    }
  ]

  const overallScore = calculateOverallScore()

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
          Immi Score
        </Typography>
        <Typography variant='body2'>
          Your immigration eligibility assessment and scoring
        </Typography>
      </Grid>

      {/* Main Score Card */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Overall Immigration Score' />
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', mb: 4 }}>
              <Box 
                sx={{ 
                  position: 'relative', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: 180, 
                  height: 180, 
                  borderRadius: '50%', 
                  border: '10px solid #f0f0f0',
                  mb: 2
                }}
              >
                <Typography variant='h2'>{overallScore}</Typography>
              </Box>
              <Typography variant='h6'>
                {overallScore >= 75 
                  ? 'Excellent Candidate!' 
                  : overallScore >= 60 
                    ? 'Good Potential' 
                    : 'Additional Considerations Needed'}
              </Typography>
            </Box>
            <Typography variant='body2' sx={{ mb: 2 }}>
              Your overall immigration score is calculated as an average of your scores in education, work experience, age, and adaptability.
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Score Breakdown Cards */}
      {categories.map((category, index) => (
        <Grid item xs={12} md={6} key={index}>
          <Card>
            <CardHeader title={category.name} />
            <CardContent>
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant='body2'>{category.name} Score</Typography>
                  <Typography variant='body2'>{category.score}/100</Typography>
                </Box>
                <StyledLinearProgress variant='determinate' value={category.score} />
              </Box>
              <Box sx={{ mb: 3 }}>
                {Object.keys(category.selections).map((factor) => (
                  <FormControl fullWidth sx={{ mb: 2 }} key={factor}>
                    <InputLabel>{factor}</InputLabel>
                    <Select
                      value={category.selections[factor]}
                      label={factor}
                      onChange={(e) => handleSelectionChange(category.name, factor, e.target.value)}
                    >
                      {Object.keys(category.criteria[factor]).map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ))}
              </Box>
              <Box>
                <Typography variant='body2' sx={{ mb: 2 }}>Selected Factors:</Typography>
                {category.factors.map((factor, i) => (
                  <Chip 
                    key={i} 
                    label={factor} 
                    variant='outlined' 
                    sx={{ mr: 1, mb: 1 }} 
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}

      {/* Recommendations Card */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Improvement Recommendations' />
          <CardContent>
            <Typography variant='body2' paragraph>
              Based on your current score, here are some areas you could improve to strengthen your immigration application:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Item>
                <Typography variant='subtitle1'>Improve Language Proficiency</Typography>
                <Typography variant='body2'>
                  Taking additional language tests or courses could boost your overall score by 5-10 points.
                </Typography>
              </Item>
              <Item>
                <Typography variant='subtitle1'>Gain Additional Work Experience</Typography>
                <Typography variant='body2'>
                  Each additional year of relevant work experience can increase your score.
                </Typography>
              </Item>
              <Item>
                <Typography variant='subtitle1'>Education Credentials</Typography>
                <Typography variant='body2'>
                  Consider pursuing additional education or certifications relevant to your field.
                </Typography>
              </Item>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

ImmiScore.getLayout = page => <ImmigrantLayout>{page}</ImmigrantLayout>

export default ImmiScore 