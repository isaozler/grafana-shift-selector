import { useCallback, useEffect, useState } from "react"
import { useDispatch, useStoreState, useSubscribe } from "../hook"
import { store, TState } from "../reducer/props"

export const useProps = () => {
  const dispatch = useDispatch()
  const [state, setState] = useState<TState>(store.subject.getValue())
  const shiftsStore = useSubscribe(store.subject)

  const getState = useCallback(() => {
    if (state?.state) {
      return state.state
    }

    return null
  }, [state])

  useEffect(() => {
    console.log('state debug', 'shifts', {state})
  }, [state])

  useEffect(() => {
    const subscriptionState = shiftsStore(setState)

    return () => {
      subscriptionState.unsubscribe()
    }
  }, [shiftsStore])

  return {
    getState,
  }
}
