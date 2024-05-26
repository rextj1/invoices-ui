<script>
export default {
  middleware({ $auth, redirect }) {
    // If the user is not authenticated
    if (!$auth.loggedIn) {
      return redirect("auth/login");
    }

    return redirect({ name: "customers" });
  },

  render() {
    return null;
  },
};
</script>
