let navigation;

function navigate(route) {
  navigation.navigate(route);
}

function reset(route) {
  navigation.reset({
    index: 0,
    routes: [{name: route}]
  })
}

function setRootNavigator(rootNavigatorRef) {
  navigation = rootNavigatorRef;
}

export default { navigate, reset, setRootNavigator };