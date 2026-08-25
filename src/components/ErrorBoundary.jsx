import { Component } from 'react'

/**
 * Without this, any render error unmounts the whole tree and leaves a blank
 * white page with no explanation. A birthday surprise should never fail
 * silently — show what went wrong and offer a way back.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Keep the details in the console for whoever is debugging.
    console.error('Something broke in the birthday site:', error, info)
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <div className="crash" role="alert">
        <p className="crash__emoji">🎀😿</p>
        <h1 className="crash__title">Something went wrong</h1>
        <p className="crash__body">
          The party hit a bug. Aila is still objectively the prettiest — that
          part is unaffected.
        </p>
        <pre className="crash__detail">{String(error?.message || error)}</pre>
        <button
          type="button"
          className="btn"
          onClick={() => window.location.reload()}
        >
          RELOAD 🔁
        </button>
      </div>
    )
  }
}
