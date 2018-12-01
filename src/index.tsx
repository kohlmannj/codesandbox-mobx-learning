import * as React from 'react';
import { render } from 'react-dom';
import { configure, observable, observe, when, action } from 'mobx';
import { observer } from 'mobx-react';
import Hello from './Hello';

configure({ enforceActions: 'always' });

interface IScene {
  url: string;
  loaded: boolean;
  shown: boolean;
}

interface IStore {
  api: 'nytar' | 'webgl' | undefined;
  width: number | undefined;
  height: number | undefined;
  scenes: IScene[];
  currentScene: string | undefined;
}

const store = observable({
  api: undefined,
  width: undefined,
  height: undefined,
  scenes: [],
  currentScene: undefined,
} as IStore);

const setDimensions = action(() => {
  if (typeof window !== 'undefined') {
    store.width = window.innerWidth;
    store.height = window.innerHeight;
  }
});

const addScene = /* action(*/ (url: string) => {
    if (store.scenes.find(s => s.url === url)) {
      throw new Error(`Scene with url '${url}' already exists in the state store`);
    }

    store.scenes.push({
      url,
      loaded: false,
      shown: false,
    });
  } /*)*/;

store.scenes.push({
  url: 'https://www.nytimes.com/',
  loaded: false,
  shown: false,
});

const loadScene = action((url: string) => {
  const scene = store.scenes.find(s => s.url === url);

  if (scene) {
    scene.loaded = true;
    console.log(`Loaded scene: ${url}`);
  } else {
    throw new Error(`Unknown scene: '${url}'`);
  }
});

const showScene = action((url: string) => {
  const scene = store.scenes.find(s => s.url === url);

  if (scene) {
    if (scene.loaded) {
      store.currentScene = url;
      scene.shown = true;
      console.log(`Showed scene: ${url}`);
    } else {
      throw new Error(`Scene hasn't been loaded: `);
    }
  }
});

when(() => typeof window !== 'undefined' && (!store.width || !store.height), setDimensions);

const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center',
};

const App = observer(() => (
  <div style={styles}>
    <Hello name="CodeSandbox" />
    <h2>Start editing to see some magic happen {'\u2728'}</h2>
    <dl>
      <dt>Width</dt>
      <dd>{store.width}</dd>
      <dt>Height</dt>
      <dd>{store.height}</dd>
    </dl>
    <hr />
    <h3>Scenes</h3>
    <dl>
      {store.scenes.map((s, i) => (
        <React.Fragment key={i}>
          <dt>Scene {i}</dt>
          <dd>
            {s.url}{' '}
            {s.loaded ? (
              <em>Loaded</em>
            ) : (
              <a
                href="#"
                onClick={() => {
                  loadScene(s.url);
                }}
              >
                Load
              </a>
            )}
            {' | '}
            {s.shown ? (
              <em>Shown</em>
            ) : (
              s.loaded && (
                <a
                  href="#"
                  onClick={() => {
                    showScene(s.url);
                  }}
                >
                  Show
                </a>
              )
            )}
          </dd>
        </React.Fragment>
      ))}
    </dl>
    <h3>Current Scene: {store.currentScene || 'None'}</h3>
    <button
      onClick={() => {
        addScene('https://www.nytimes.com/');
      }}
    >
      Add Scene
    </button>
  </div>
));

render(<App />, document.getElementById('root'));
