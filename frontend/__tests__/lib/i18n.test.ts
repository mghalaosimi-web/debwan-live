jest.unmock('@/lib/i18n')

jest.mock('i18next-browser-languagedetector', () => ({
  __esModule: true,
  default: {
    type: '3rdParty',
    init: jest.fn(),
    detect: jest.fn(() => 'es'),
    cacheUserLanguage: jest.fn(),
  },
}))

describe('i18n configuration', () => {
  it('exports an initialized i18n instance', () => {
    jest.isolateModules(() => {
      const i18n = require('@/lib/i18n').default
      expect(i18n).toBeDefined()
      expect(i18n.isInitialized).toBe(true)
    })
  })

  it('loads Spanish and English resources with Spanish fallback', () => {
    jest.isolateModules(() => {
      const i18n = require('@/lib/i18n').default
      expect(i18n.options.fallbackLng).toContain('es')
      expect(i18n.hasResourceBundle('es', 'translation')).toBe(true)
      expect(i18n.hasResourceBundle('en', 'translation')).toBe(true)
    })
  })

  it('keeps React-safe interpolation', () => {
    jest.isolateModules(() => {
      const i18n = require('@/lib/i18n').default
      expect(i18n.options.interpolation?.escapeValue).toBe(false)
    })
  })

  it('uses the Debwan Live brand and Spanish navigation translations', () => {
    jest.isolateModules(() => {
      const i18n = require('@/lib/i18n').default
      i18n.changeLanguage('es')
      expect(i18n.t('app.name')).toBe('DEBWAN LIVE')
      expect(i18n.t('nav.home')).toBe('Inicio')
    })
  })

  it('supports English translations', () => {
    jest.isolateModules(() => {
      const i18n = require('@/lib/i18n').default
      i18n.changeLanguage('en')
      expect(i18n.t('app.name')).toBe('DEBWAN LIVE')
      expect(i18n.t('nav.home')).toBe('Home')
    })
  })

  it('uses the Debwan-specific language storage key', () => {
    jest.isolateModules(() => {
      const i18n = require('@/lib/i18n').default
      expect(i18n.options.detection?.order).toEqual(['localStorage', 'navigator'])
      expect(i18n.options.detection?.lookupLocalStorage).toBe('debwan_lang')
      expect(i18n.options.detection?.caches).toEqual(['localStorage'])
    })
  })
})
