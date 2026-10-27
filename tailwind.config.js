module.exports = {
  content: ["./www/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        page: '#e9eeec',
        panel: '#f7f9f8',
        ink: {
          main: '#15333a',
          muted: '#6b8187',
          header: '#1a332e'
        },
        borderLine: '#d3dcda',
        highlight: {
          amber: '#d99a1c',
          red: '#c8493f'
        },
        // 12 Pastel Tag Accent Colors
        pastel: {
          sage: '#cfe3d6',
          sky: '#cddfee',
          lilac: '#ddd5ee',
          sun: '#f6e2a8',
          rose: '#f2d3d3',
          peach: '#f8d9bf',
          coral: '#f5c2b8',
          lime: '#dfe9b5',
          mint: '#c3eadb',
          aqua: '#bfe4ea',
          periwinkle: '#cfd3f2',
          stone: '#ddd9d3'
        }
      },
      fontFamily: {
        serif: ['Newsreader', 'serif'],
        digits: ['Bricolage Grotesque', 'monospace']
      }
    }
  },
  plugins: []
}