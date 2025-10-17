import fs from 'fs'
import path from 'path'

/**
 * Interface for project context
 */
export interface ProjectContext {
  readme: string
  aiContent: Record<string, any>
  projectName?: string
  projectDescription?: string
  aiConfig?: {
    theme?: string
    primaryColor?: string
    secondaryColor?: string
    prioritizeAiContent?: boolean
  }
}

/**
 * Parse project context from README.md and .ai folder
 * @param rootDir - Root directory of the project
 * @returns Project context object
 */
export const parseProjectContext = (rootDir: string): ProjectContext => {
  const readmePath = path.join(rootDir, 'README.md')
  const aiFolder = path.join(rootDir, '.ai')
  const aiConfigPath = path.join(aiFolder, 'config.json')

  const context: ProjectContext = {
    readme: '',
    aiContent: {},
    aiConfig: {
      theme: 'light',
      primaryColor: '#0070f3',
      secondaryColor: '#6366f1',
      prioritizeAiContent: true,
    },
  }

  if (fs.existsSync(readmePath)) {
    try {
      context.readme = fs.readFileSync(readmePath, 'utf8')
      console.log('Successfully parsed README.md')
    } catch (error) {
      console.error('Error reading README.md:', error)
    }
  } else {
    console.warn('README.md not found in', rootDir)
  }

  if (fs.existsSync(aiFolder)) {
    try {
      if (fs.existsSync(aiConfigPath)) {
        try {
          const configContent = fs.readFileSync(aiConfigPath, 'utf8')
          const config = JSON.parse(configContent)
          context.aiConfig = { ...context.aiConfig, ...config }
          console.log('Successfully parsed .ai/config.json')
        } catch (error) {
          console.error('Error parsing .ai/config.json:', error)
        }
      }

      // Parse all files in the .ai folder
      parseAiFolder(aiFolder, context.aiContent)
      console.log('Successfully parsed .ai folder')
    } catch (error) {
      console.error('Error reading .ai folder:', error)
    }
  } else {
    console.warn('.ai folder not found in', rootDir)
    createDefaultAiFolder(rootDir)
  }

  return context
}

/**
 * Parse all files in the .ai folder recursively
 * @param folderPath - Path to the .ai folder or subfolder
 * @param contentObj - Object to store the parsed content
 * @param prefix - Prefix for nested keys
 */
const parseAiFolder = (folderPath: string, contentObj: Record<string, any>, prefix = ''): void => {
  const files = fs.readdirSync(folderPath)

  for (const file of files) {
    const filePath = path.join(folderPath, file)
    const stats = fs.statSync(filePath)

    if (stats.isFile()) {
      if (file === 'config.json' && prefix === '') continue

      const fileContent = fs.readFileSync(filePath, 'utf8')
      const fileName = path.basename(file, path.extname(file))
      const key = prefix ? `${prefix}.${fileName}` : fileName

      contentObj[key] = fileContent
    } else if (stats.isDirectory()) {
      const dirName = path.basename(file)
      const newPrefix = prefix ? `${prefix}.${dirName}` : dirName
      contentObj[dirName] = {}

      parseAiFolder(filePath, contentObj[dirName], '')
    }
  }
}

/**
 * Create default .ai folder structure
 * @param rootDir - Root directory of the project
 */
const createDefaultAiFolder = (rootDir: string): void => {
  const aiFolder = path.join(rootDir, '.ai')

  try {
    if (!fs.existsSync(aiFolder)) {
      fs.mkdirSync(aiFolder)
    }

    const configPath = path.join(aiFolder, 'config.json')
    if (!fs.existsSync(configPath)) {
      const defaultConfig = {
        theme: 'light',
        primaryColor: '#0070f3',
        secondaryColor: '#6366f1',
        prioritizeAiContent: true,
      }
      fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2))
    }

    const featuresPath = path.join(aiFolder, 'features.md')
    if (!fs.existsSync(featuresPath)) {
      fs.writeFileSync(featuresPath, '- Feature 1\n- Feature 2\n- Feature 3')
    }

    const benefitsPath = path.join(aiFolder, 'benefits.md')
    if (!fs.existsSync(benefitsPath)) {
      fs.writeFileSync(benefitsPath, '- Benefit 1\n- Benefit 2\n- Benefit 3')
    }

    const ctaPath = path.join(aiFolder, 'cta.md')
    if (!fs.existsSync(ctaPath)) {
      fs.writeFileSync(ctaPath, 'Join the Waitlist')
    }

    const questionsPath = path.join(aiFolder, 'questions.md')
    if (!fs.existsSync(questionsPath)) {
      fs.writeFileSync(
        questionsPath,
        '- What is your primary use case?\n- What problems are you trying to solve?\n- How are you currently solving this problem?\n- How large is your team?\n- What is your timeline for implementing a solution?'
      )
    }

    console.log('Created default .ai folder structure')
  } catch (error) {
    console.error('Error creating default .ai folder structure:', error)
  }
}
