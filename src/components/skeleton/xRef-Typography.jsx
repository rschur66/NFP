import React from 'react';

const Typography = () =>{

  return(
    <div className="bodyContentCMS">
      <h1>This Is Headline 1</h1>
      <h2>This Is Headline 2</h2>
      <h3>This Is Headline 3</h3>
      <h4>This Is Headline 4</h4>
      <h5>This Is Headline 5</h5>
      <h5 className="alt">This Is Headline 5 + .alt</h5>
      <h6>This Is Headline 6</h6>
      <h6 className="alt">This Is Headline 6 + .alt</h6>
      <p>
        Suspendisse eu rhoncus massa. Nulla eget sodales est. Fusce at laoreet odio. Nunc et dictum leo, non consectetur lectus. Nullam finibus felis quis justo dignissim, in luctus augue tempor. Donec id metus nisi. Pellentesque ac risus in ligula pharetra molestie. Curabitur ultrices dapibus lorem, sed interdum lorem bibendum sit amet. Aenean dolor eros, consequat id cursus vitae, tincidunt at magna. Maecenas ante ipsum, laoreet condimentum dapibus sed, iaculis in justo. Phasellus sollicitudin convallis cursus. Maecenas consectetur maximus suscipit. Duis mauris massa, pharetra nec nulla at, rhoncus eleifend nisl. Morbi vehicula nulla tincidunt, porta justo id, dignissim urna. Fusce id ante rutrum, eleifend arcu sit amet, tempor nisi. Vestibulum tincidunt posuere justo quis viverra.
      </p>
      <h6>This Is Headline 6 between p's</h6>
      <p>
        Pellentesque auctor elit eget neque efficitur hendrerit. Morbi eget massa odio. Curabitur pharetra non arcu eu mattis. Etiam facilisis neque vehicula tellus ultrices, at accumsan erat dictum. Nulla nec tincidunt leo, non mollis felis. Quisque ut pharetra ipsum. Vivamus lectus lorem, ultrices ac nibh quis, efficitur tempus massa. Sed ac tristique massa.
      </p>
      <p>
        Proin vulputate blandit augue eu pellentesque. Nulla eget massa justo. Quisque elementum, erat eget consectetur tempus, justo dui bibendum eros, at pellentesque erat velit eget tellus. Aliquam sem massa, dictum vel leo vel, venenatis lobortis lectus. Integer augue nibh, egestas nec dolor in, molestie laoreet ex. Morbi faucibus lacinia purus, a lacinia justo venenatis at. Aliquam vel eleifend tortor, a gravida massa. Integer tempor nec lectus vitae viverra. Donec fermentum non odio quis rutrum.
      </p>

      <h1 className="bigBarHeader">bigBarHeader</h1>
      
      <div className="highlightBg">
        <h4 className="knockout">&nbsp;h4 + knockout on highlightBg</h4>
      </div>
      <br />
      <br />
      <h3 className="sectionHeader">This is h3 + sectionHeader</h3>

      <h3 className="alt">This is h3 + alt</h3>

      <span className="smallText">This is smallText</span>
      <br />
      <br />
      <span className="helperText">This is helperText</span>
      <br />
      <br />
      <span className="error">This is error</span>
    </div>

  );
}

export default Typography;