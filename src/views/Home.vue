<template>
  <main class="home-page">
    <h1>Dashboard</h1>
    <hr />

    <div class="cards">
      <router-link class="card" to="/training">
        <img src="/play.svg" />
        <h3>Training</h3>
        <p>Start a new training or view all of your current trainings</p>
      </router-link>
      <router-link class="card" to="/training">
        <img src="/table.svg" />
        <h3>Results</h3>
        <p>View all of your recent results and manage trainings</p>
      </router-link>
      <router-link class="card" to="/analysis">
        <img src="/stats.svg" />
        <h3>Analysis</h3>
        <p>Visualize your results with real-time charts</p>
      </router-link>
    </div>

    <div class="text">
      <p>
        The dashboard serves as a platform to streamline the management of AI training sessions,
        specifically tailored for FootChaos, a 2D car game reminiscent of Rocket League. However,
        it can be adapted to other systems with minor modifications.
      </p>
      <p>
        It encompasses the following key features:
      </p>
      <p>
        The Creation and Management of Training Sessions:
        Users can initiate new training sessions on the main page by specifying the number of networks
        and group sizes. Additionally, they have the option to commence an existing training session
        from the same page.
      </p>
      <p>
        Results Analysis Page:
        This section offers a comprehensive analysis of the results, presented through a graphical
        interface showcasing various data points relative to the generation.
        Users can track the performance of their networks over time, enabling them to make informed
        decisions to enhance the effectiveness of their training sessions.
      </p>
      <p>
        In essence, the dashboard provides an intuitive and efficient interface for managing AI
        training sessions, offering tools for creation, monitoring, and optimization of neural network
        performance, primarily tailored for FootChaos while being adaptable to other systems with
        appropriate adjustments.
      </p>
    </div>

  </main>
</template>

<style scoped>
main {
  background-color: var(--dark);
  color: #ffffff;

  hr {
    margin-bottom: 10px;
  }

  .cards {

    display: flex;
    justify-content: space-between;

    .card {
      background-color: var(--light);
      width: 100%;
      margin: 1rem;
      border-radius: 4px;
      border-color: var(--stroke);
      border-width: 2px;
      border-style: solid;
      padding: 1rem;
      cursor: pointer;
      text-decoration: none;
      color: var(--primary-text);

      img {
        filter: brightness(0) invert(1);
        width: 32px;
        height: auto;
        padding-bottom: 1rem;
      }

      p {
        color: var(--secondary-text);
        padding-top: 0.5rem;
        padding-bottom: 1rem;
      }
    }
  }

  .text {
    padding-top: 3rem;

    p {
      color: var(--secondary-text);
      line-height: 1.6;
      text-align: justify;
      margin-bottom: 1rem;
    }
  }


}
</style>
